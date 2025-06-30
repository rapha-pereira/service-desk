import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonToast,
  IonSpinner,
  IonCheckbox,
  IonList,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  ticketOutline,
  personOutline,
  calendarOutline,
  refreshOutline,
  logOutOutline,
  addOutline,
  chevronDownCircleOutline,
} from 'ionicons/icons';

export interface Incident {
  cod_incidente: number;
  assunto: string;
  descricao: string;
  data_abertura: string;
  status: string;
  nome_solicitante: string;
}

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.page.html',
  styleUrls: ['./incidents.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonToast,
    IonSpinner,
    IonCheckbox,
    IonList,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonFabButton,
  ],
})
export class IncidentsPage implements OnInit {
  incidents: Incident[] = [];
  currentUser: User | null = null;
  isLoading: boolean = false;
  showMyIncidents: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'danger';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      ticketOutline,
      personOutline,
      calendarOutline,
      refreshOutline,
      logOutOutline,
      addOutline,
      chevronDownCircleOutline,
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    // If not logged in, redirect to login page
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadIncidents();
  }

  async loadIncidents() {
    this.isLoading = true;

    try {
      let url =
        'https://reimagined-sniffle-xqrgjpqg6v5hr-3000.app.github.dev/api/incidents';

      if (this.showMyIncidents && this.currentUser) {
        url += `?attendantId=${this.currentUser.cod_usuario}`;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      const response = await this.http
        .get<Incident[]>(url, { headers })
        .toPromise();
      this.incidents = response || [];
    } catch (error: any) {
      console.error('Erro ao carregar incidentes:', error);
      this.showToastMessage('Erro ao carregar incidentes', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  // loadIncidents takes care of checkbox being selected to show only my
  // incidents or if checkbox is empty without the selection of my incidents
  onCheckboxChange() {
    this.loadIncidents();
  }

  // If user refresh page, the on init will load to check if logged in
  // and the incidents will be reloaded
  async handleRefresh(event: any) {
    await this.loadIncidents();
    event.target.complete();
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'aberto':
        return 'primary';
      case 'em andamento':
        return 'warning';
      case 'fechado':
        return 'success';
      default:
        return 'medium';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }

  trackByIncidentId(index: number, incident: Incident): number {
    return incident.cod_incidente;
  }

  async takeIncident(incidentId: number) {
    if (!this.currentUser) return;

    this.isLoading = true;

    try {
      const updateData = {
        atendente: this.currentUser.cod_usuario,
        // Assumir um SLA de 7 dias, sei lá, kkkkk
        data_previsao: new Date(Date.now() + 7 * 86400000)
          .toISOString()
          .split('T')[0],
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      const response = await this.http
        .put(
          `https://reimagined-sniffle-xqrgjpqg6v5hr-3000.app.github.dev/api/incidents/${incidentId}`,
          updateData,
          { headers, observe: 'response' }
        )
        .toPromise();

      if (response?.status === 200) {
        this.showToastMessage('Incidente assumido com sucesso!', 'success');
        this.loadIncidents(); // Recarregar a lista
      }
    } catch (error: any) {
      console.error('Erro ao assumir incidente:', error);
      this.showToastMessage('Erro ao assumir incidente', 'danger');
    } finally {
      this.isLoading = false;
    }
  }
}
