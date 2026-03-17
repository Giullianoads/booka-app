import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon]
})
export class HomePage {
  statusConexao: string = '';

  constructor(private supabase: SupabaseService) {}

  async verificarConexao() {
    this.statusConexao = 'Verificando...';
    const result = await this.supabase.testConnection();
    this.statusConexao = result.message;
  }
}
