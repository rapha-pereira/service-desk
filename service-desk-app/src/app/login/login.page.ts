import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  IonInput,
  IonButton,
  IonIcon,
  IonToast,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline, personOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
    IonInput,
    IonButton,
    IonIcon,
    IonToast,
    IonSpinner,
  ],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'danger';

  constructor(private router: Router, private http: HttpClient) {
    addIcons({ logInOutline, personOutline, lockClosedOutline });
  }

  async onLogin() {
    if (!this.email || !this.password) {
      this.showToastMessage('Por favor, preencha todos os campos', 'warning');
      return;
    }

    this.isLoading = true;

    const loginData = {
      email: this.email,
      senha: this.password,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    try {
      const response = await this.http
        .post(
          'https://reimagined-sniffle-xqrgjpqg6v5hr-3000.app.github.dev/api/login',
          loginData,
          {
            headers,
            observe: 'response',
          }
        )
        .toPromise();

      if (response?.status === 200) {
        this.showToastMessage('Login realizado com sucesso!', 'success');
        // Aguardar um pouco para mostrar a mensagem de sucesso antes de redirecionar
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      if (error.status === 401 || error.status === 403) {
        this.showToastMessage('Email ou senha incorretos', 'danger');
      } else {
        this.showToastMessage(
          'Erro interno do servidor. Tente novamente.',
          'danger'
        );
      }
    } finally {
      this.isLoading = false;
    }
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  onToastDismiss() {
    this.showToast = false;
  }
}
