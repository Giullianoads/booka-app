import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { 
  IonContent, IonCard, IonSegment, IonSegmentButton, 
  IonLabel, IonItem, IonInput, IonButton, IonIcon, IonTextarea
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { eyeOutline } from 'ionicons/icons';

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
    IonLabel, IonItem, IonInput, IonButton, IonIcon, IonTextarea
  ]
})
export class CadastroPage implements OnInit {
  
  // Controla quais campos aparecem no HTML (Começa como 'cliente')
  tipoUsuario: string = 'cliente'; 

  constructor() { 
    addIcons({ eyeOutline });
  }

  ngOnInit() {}

}