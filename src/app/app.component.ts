import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GameDataService } from './shared/game-data.service';
import { Router } from '@angular/router'
import { AuthService } from './shared/auth.service';

import { LoginResultsComponent } from './login-results/login-results.component';
import { ToastrService } from 'ngx-toastr';
import { MessagingService } from './shared/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.css']
})
export class AppComponent {
  darkMode: boolean = true;
  started: boolean = false;
  loggedIn: boolean = false;
  resultsShow: boolean = true;
  startOverlay: boolean = true;
  title = 'kd-vakondcsapda-canvas';
  message;

  startedSub;
  loggedInSub;
  resultsShowSub;
  currentMessageSub;

  constructor(private store: AngularFirestore, private dataService: GameDataService, public router: Router, private authService: AuthService, private toast: ToastrService, private messagingService: MessagingService) {
    this.startedSub = this.dataService.currentStarted.subscribe(value => this.started = value);
    this.loggedInSub = this.dataService.currentLoggedIn.subscribe(value => this.loggedIn = value);
    this.resultsShowSub = this.dataService.currentResultsShow.subscribe(value => this.resultsShow = value);
    this.currentMessageSub = this.messagingService.getCurrentMessage().subscribe(value => value ? this.toast.info(value.notification.body, value.notification.title) : '')
  }

  ngOnDestroy(): void {
    this.startedSub.unsubscribe();
    this.loggedInSub.unsubscribe();
    this.resultsShowSub.unsubscribe();
    this.currentMessageSub.unsubscribe();
  }

  signOut() {
    this.authService.signOut();
    this.dataService.changeLoggedIn(false);
    this.router.navigate(['']);
  }

  playTest(){
    this.dataService.changeStartTrialGame(true);
  }

}
