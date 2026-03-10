import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { 
  IonContent, IonCard, IonSegment, IonSegmentButton, 
  IonLabel, IonItem, IonInput, IonNote, IonButton, IonRow, IonCol, IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { logoGoogle, logoApple, eyeOutline } from 'ionicons/icons'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    IonContent, IonCard, IonSegment, IonSegmentButton, 
    IonLabel, IonItem, IonInput, IonNote, IonButton, IonRow, IonCol, IonIcon
  ]
})
export class LoginPage implements OnInit {
  
  tipoUsuario: string = 'cliente'; 

  constructor() { 
    addIcons({ logoGoogle, logoApple, eyeOutline });
  }

  ngOnInit() {}

}