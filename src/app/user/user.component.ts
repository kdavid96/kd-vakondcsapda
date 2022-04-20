import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { MessagingService } from '../shared/messaging.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.css']
})
export class UserComponent implements OnInit {
  @Input() isProfileOverlayOpen: boolean;
  @Output() outputProfileOverlayOpen : EventEmitter<boolean> = new EventEmitter();
  @Input() isLoggedInInput: boolean;
  @Output() isLoggedInOutput: EventEmitter<Boolean> = new EventEmitter();
  @Input() isStartingGuideOpen: boolean;
  @Input() isGameStarted: boolean;
  @Output() isClickedOutput: EventEmitter<Boolean> = new EventEmitter();
  currentToken: BehaviorSubject<any> = new BehaviorSubject(null);
  cookieExists: boolean = false;
  isRegistering: boolean = false;
  isLoggingIn: boolean = false;
  registered: boolean = true;
  isLoggedIn: boolean = false;
  isFollowing: boolean = false;
  isEditing: boolean = false;
  user$: BehaviorSubject<any> = new BehaviorSubject(null);
  user: any;
  playedGames: number = 0;
  avgTimePlayed: number = 0;
  bestScore: number = 0;
  avgScore: number = 0;
  allMolesHit: number = 0;
  allMolesMissed: number = 0;


  constructor(private authService: AuthService, private cookieService: CookieService, private messagingService: MessagingService, public router: Router) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.user$.next(user.data);
      this.user = user.data;
      if(user.data){
        this.isLoggedIn = true;
        this.isLoggedInOutput.emit(true);
        this.checkUserCookie();
        this.sendDataToParent();
        this.getUserStats();
      }else{
        this.isLoggedIn = false;
        this.isLoggedInOutput.emit(false);
        this.sendDataToParent();
      }
    });
  }

  async getUserStats(){
    this.authService.getStats().subscribe(stats => {
      this.playedGames = stats.playedGames;
      this.avgTimePlayed = stats.avgTimePlayed;
      this.bestScore = stats.bestScore;
      this.avgScore = stats.avgScore;
      this.allMolesHit = stats.allMolesHit;
      this.allMolesMissed = stats.allMolesMissed;
    })
  }

  sendDataToParent() {
    this.outputProfileOverlayOpen.emit(!this.isProfileOverlayOpen);
    this.isClickedOutput.emit(this.cookieExists);
  }

  signOut() {
    this.authService.signOut();
    this.isLoggedIn = false;
    this.sendDataToParent();
    this.router.navigate(['']);
  }

  checkUserCookie(): void {
    this.messagingService.requestPermission();
    this.currentToken = this.messagingService.currentToken;
    this.currentToken.subscribe(token => {
      if(token){
        const userCookie = this.cookieService.get(token);
        if(userCookie !== '' && userCookie !== null){
          this.cookieExists = true;
          this.isClickedOutput.emit(true);
        }
      }
    })
  }
}
