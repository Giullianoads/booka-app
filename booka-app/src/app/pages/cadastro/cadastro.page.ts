import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { 
  IonContent, IonCard, IonSegment, IonSegmentButton, 
  IonLabel, IonItem, IonInput, IonButton, IonIcon, 
  IonTextarea, IonRow, IonCol, IonProgressBar
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { eyeOutline, arrowBackOutline } from 'ionicons/icons';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    IonContent, IonCard, IonSegment, IonSegmentButton, 
    IonLabel, IonItem, IonInput, IonButton, IonIcon, 
    IonTextarea, IonRow, IonCol, IonProgressBar
  ]
})
export class CadastroPage implements OnInit {
  
  tipoUsuario: string = 'cliente'; 
  etapaAtual: number = 1; 
  totalEtapas: number = 2;

  // Dados do Formulário
  nome: string = '';
  email: string = '';
  telefone: string = '';
  senha: string = '';
  cpf: string = '';
  cpfCnpj: string = '';
  nomeEmpresa: string = '';
  horarioFuncionamento: string = '';

  constructor(private supabase: SupabaseService) { 
    addIcons({ eyeOutline, arrowBackOutline });
  }

  ngOnInit() {}

  proximaEtapa() {
    this.etapaAtual = 2;
  }

  etapaAnterior() {
    this.etapaAtual = 1;
  }

  async criarConta() {
    const dados = {
      nome_completo: this.nome,
      email: this.email,
      password: this.senha,
      telefone: this.telefone,
      tipo_usuario: this.tipoUsuario,
      cpf: this.cpf,
      cpf_cnpj: this.cpfCnpj,
      nome_empresa: this.nomeEmpresa,
      horario_funcionamento: this.horarioFuncionamento
    };

    console.log('Tentando criar conta:', dados);
    const result = await this.supabase.signUp(dados);
    
    if (result.success) {
      alert('Cadastro realizado com sucesso! Verifique seu e-mail.');
    } else {
      alert('Erro ao cadastrar: ' + result.message);
    }
  }

  async testeCadastroRapido() {
    const randomId = Math.floor(Math.random() * 1000);
    this.nome = `Teste_${randomId}`;
    this.email = `teste${randomId}@booka.com`;
    this.senha = '12345678';
    this.telefone = '(11) 99999-9999';
    this.cpf = '123.456.789-00';
    this.tipoUsuario = 'cliente';
    
    console.log('Executando teste de cadastro rápido...');
    await this.criarConta();
  }
}