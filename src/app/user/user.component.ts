import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.css']
})
export class UserComponent implements OnInit {
  @Input() isProfileOverlayOpen: boolean;
  @Output() outputProfileOverlayOpen : EventEmitter<boolean> = new EventEmitter();
  @Input() isStartingGuideOpen: boolean;
  @Input() isGameStarted: boolean;
  isRegistering: boolean = false;
  isLoggingIn: boolean = false;
  registered: boolean = true;
  error: boolean = false;
  isLoggedIn: boolean = false;
  isFollowing: boolean = false;
  isEditing: boolean = false;
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

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
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
  });

  loginForm = this.formBuilder.group({
    emailLogin: '',
    passwordLogin: ''
  });

  ngOnInit() {
    this.authService.getUser().subscribe(user => 
      this.user = JSON.parse(user.toString()));
    //[this.playedGames,this.avgTimePlayed,this.bestScore,this.avgScore,this.allMolesHit,this.allMolesMissed] = this.authService.getUserStats();
    this.authService.getUserStats();
  }

  clearForm(): void {
    this.loginForm.reset();
    this.registerForm.reset();
  }

  sendDataToParent() {
    this.outputProfileOverlayOpen.emit(!this.isProfileOverlayOpen);
  }

  async onSubmitLogin() {
    await this.authService.signIn(this.loginForm.value.emailLogin, this.loginForm.value.passwordLogin)
      .then(() => {
        this.loginForm.reset();
        this.isLoggingIn = false;     
        console.log('Your login has been submitted');
        this.isLoggedIn = true;
        this.user = this.authService.getUser();
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
    if(this.registerForm.value.username === null || this.registerForm.value.email === null || this.registerForm.value.password === null || this.registerForm.value.passwordRe === null || this.registerForm.value.education === null || this.registerForm.value.gender === null){
      this.error = true;
      this.errorMessage = 'Az összes mező kitöltése kötelező!';
      return;
    }
    
    if(this.registerForm.value.password !== this.registerForm.value.passwordRe){
      this.error = true;
      this.errorMessage = 'A két jelszó nem egyezik meg!';
      return;
    }

    await this.authService.signUp(this.registerForm.value.username, this.registerForm.value.email, this.registerForm.value.password, this.registerForm.value.ageGroup, this.registerForm.value.education)
    .then(() => {
      this.registerForm.reset();
      console.log('Your registration has been submitted');
      this.isLoggedIn = true;
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
  }

}
