import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { GameDataService } from '../shared/game-data.service';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.css']
})
export class LoginComponent implements OnInit {

  error: boolean = false;
  errorMessage: string = "";

  ageGroups: string[] = ['0-20', '20-40', '40-60', '60-80', '80-'];
  educationList: string[] = ['Nincs', 'Általános iskola', 'Szakmunkásképző', 'Érettségi', 'Diploma', 'PhD'];

  constructor(private formBuilder: FormBuilder, private authService: AuthService, public router: Router, private dataService: GameDataService) { }
  
  loginForm = this.formBuilder.group({
    emailLogin: '',
    passwordLogin: ''
  });

  ngOnInit(): void {
  }

  async onSubmitLogin() {
    await this.authService.signIn(this.loginForm.value.emailLogin, this.loginForm.value.passwordLogin)
      .then(async () => {
        this.loginForm.reset();
        this.dataService.changeLoggedIn(true);
        this.router.navigateByUrl('/');
        this.authService.user$.subscribe(user => {if(user.data.token) this.dataService.changeShowGuide(false)});
      })
      .catch(error => {
        this.loginForm.reset();
        this.error = true;
        this.errorMessage = error;
      });
  }

}
