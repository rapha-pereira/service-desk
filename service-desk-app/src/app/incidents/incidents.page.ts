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
  IonModal,
  IonInput,
  IonTextarea,
  IonButtons,
  AlertController,
  ModalController,
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
  createOutline,
  trashOutline,
  saveOutline,
  closeOutline,
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
    IonModal,
    IonInput,
    IonTextarea,
    IonButtons,
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

  // Modal properties
  isModalOpen: boolean = false;
  isEditing: boolean = false;
  currentIncidentId: number | null = null;

  // Form properties
  formData = {
    usuario: '',
    atendente: '',
    assunto: '',
    descricao: '',
    data_previsao: '',
  };

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    addIcons({
      ticketOutline,
      personOutline,
      calendarOutline,
      refreshOutline,
      logOutOutline,
      addOutline,
      chevronDownCircleOutline,
      createOutline,
      trashOutline,
      saveOutline,
      closeOutline,
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

  // Modal methods
  openCreateModal() {
    this.isEditing = false;
    this.currentIncidentId = null;
    this.resetForm();
    this.isModalOpen = true;
  }

  openEditModal(incident: Incident) {
    this.isEditing = true;
    this.currentIncidentId = incident.cod_incidente;
    this.formData = {
      usuario: '',
      atendente: '',
      assunto: incident.assunto,
      descricao: incident.descricao,
      data_previsao: '',
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      usuario: '',
      atendente: '',
      assunto: '',
      descricao: '',
      data_previsao: '',
    };
  }

  async saveIncident() {
    if (!this.formData.assunto || !this.formData.descricao) {
      this.showToastMessage('Assunto e descrição são obrigatórios', 'warning');
      return;
    }

    this.isLoading = true;

    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      if (this.isEditing && this.currentIncidentId) {
        // Editar incidente existente
        const updateData = {
          atendente: this.formData.atendente || null,
          data_previsao: this.formData.data_previsao || null,
        };

        const response = await this.http
          .put(
            `https://reimagined-sniffle-xqrgjpqg6v5hr-3000.app.github.dev/api/incidents/${this.currentIncidentId}`,
            updateData,
            { headers, observe: 'response' }
          )
          .toPromise();

        if (response?.status === 200) {
          this.showToastMessage('Incidente atualizado com sucesso!', 'success');
        }
      } else {
        // Criar novo incidente
        const createData = {
          usuario: parseInt(this.formData.usuario) || null,
          atendente: parseInt(this.formData.atendente) || null,
          assunto: this.formData.assunto,
          descricao: this.formData.descricao,
          data_previsao: this.formData.data_previsao || null,
        };

        const response = await this.http
          .post(
            'https://reimagined-sniffle-xqrgjpqg6v5hr-3000.app.github.dev/api/incidents',
            createData,
            { headers, observe: 'response' }
          )
          .toPromise();

        if (response?.status === 201) {
          this.showToastMessage('Incidente criado com sucesso!', 'success');
        }
      }

      this.closeModal();
      this.loadIncidents();
    } catch (error: any) {
      console.error('Erro ao salvar incidente:', error);
      this.showToastMessage('Erro ao salvar incidente', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async deleteIncident(incidentId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir este incidente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.confirmDeleteIncident(incidentId);
          },
        },
      ],
    });

    await alert.present();
  }

  async confirmDeleteIncident(incidentId: number) {
    this.isLoading = true;

    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      const response = await this.http
        .delete(
          `https://reimagined-sniffle-xqrgjpqg6v5hr-3000.app.github.dev/api/incidents/${incidentId}`,
          { headers, observe: 'response' }
        )
        .toPromise();

      if (response?.status === 200) {
        this.showToastMessage('Incidente excluído com sucesso!', 'success');
        this.loadIncidents();
      }
    } catch (error: any) {
      console.error('Erro ao excluir incidente:', error);
      this.showToastMessage('Erro ao excluir incidente', 'danger');
    } finally {
      this.isLoading = false;
    }
  }
}
