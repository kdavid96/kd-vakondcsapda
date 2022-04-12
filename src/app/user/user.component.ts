import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { MessagingService } from '../shared/messaging.service';
import { BehaviorSubject } from 'rxjs';

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
  error: boolean = false;
  isLoggedIn: boolean = false;
  isFollowing: boolean = false;
  isEditing: boolean = false;
  user$: BehaviorSubject<any> = new BehaviorSubject(null);
  user: any;
  errorMessage: string = "";
  playedGames: number = 0;
  avgTimePlayed: number = 0;
  bestScore: number = 0;
  avgScore: number = 0;
  allMolesHit: number = 0;
  allMolesMissed: number = 0;

  ageGroups: string[] = ['0-20', '20-40', '40-60', '60-80', '80-'];
  educationList: string[] = ['Nincs', 'Általános iskola', 'Szakmunkásképző', 'Érettségi', 'Diploma', 'PhD'];

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private cookieService: CookieService, private messagingService: MessagingService) {
  }

  registerForm = this.formBuilder.group({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])),
    password: new FormControl('', Validators.required),
    passwordRe: new FormControl('', Validators.required),
    ageGroup: '',
    education: '',
    gender: '',
    name: '',
  });

  loginForm = this.formBuilder.group({
    emailLogin: '',
    passwordLogin: ''
  });

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

  clearForm(): void {
    this.loginForm.reset();
    this.registerForm.reset();
  }

  sendDataToParent() {
    this.outputProfileOverlayOpen.emit(!this.isProfileOverlayOpen);
    this.isClickedOutput.emit(this.cookieExists);
  }

  async onSubmitLogin() {
    await this.authService.signIn(this.loginForm.value.emailLogin, this.loginForm.value.passwordLogin)
      .then(async () => {
        this.loginForm.reset();
        this.isLoggingIn = false;     
        this.isLoggedIn = true;
        console.log('Your login has been submitted');
      })
      .catch(error => {
        this.clearForm();
        this.registered = false;
        this.error = true;
        this.errorMessage = error;
      });
  }

  async onSubmitRegister() {
    console.log(this.registerForm.value);
    if(this.registerForm.value.username === null || this.registerForm.value.email === null || this.registerForm.value.password === null || this.registerForm.value.passwordRe === null || this.registerForm.value.education === null || this.registerForm.value.gender === null || this.registerForm.value.name === null){
      this.error = true;
      this.errorMessage = 'Az összes mező kitöltése kötelező!';
      return;
    }
    
    if(this.registerForm.value.password !== this.registerForm.value.passwordRe){
      this.error = true;
      this.errorMessage = 'A két jelszó nem egyezik meg!';
      return;
    }

    await this.authService.signUp(this.registerForm.value.username, this.registerForm.value.email, this.registerForm.value.password, this.registerForm.value.ageGroup, this.registerForm.value.education, this.registerForm.value.name)
    .then(() => {
      this.registerForm.reset();
      console.log('A regisztráció sikeres!');
    })
    .catch(error => {
      this.clearForm();
      this.registered = false;
      this.error = true;
      this.errorMessage = error;
    });
  }

  signOut() {
    this.authService.signOut();
    this.isLoggedIn = false;
    this.sendDataToParent();
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
