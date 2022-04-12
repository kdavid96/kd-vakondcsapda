import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { MessagingService } from './shared/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.css']
})
export class AppComponent {
  darkMode: boolean = true;
  title = 'kd-vakondcsapda-canvas';
  message;
  constructor(private store: AngularFirestore) {
    localStorage.setItem('user', '0');
  }
}
