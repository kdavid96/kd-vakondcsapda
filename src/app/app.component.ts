import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.css']
})
export class AppComponent {
  darkMode: boolean = true;
  showStartingGuide: boolean = false;
  title = 'kd-vakondcsapda-canvas';
  constructor(private store: AngularFirestore) { }
}
