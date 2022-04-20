import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.css']
})
export class RegisterComponent implements OnInit {

  ageGroups: string[] = ['0-20', '20-40', '40-60', '60-80', '80-'];
  educationList: string[] = ['Nincs', 'Általános iskola', 'Szakmunkásképző', 'Érettségi', 'Diploma', 'PhD'];

  error: boolean = false;
  errorMessage: string = "";

  constructor(private formBuilder: FormBuilder, private authService: AuthService, public router: Router) { }

  ngOnInit(): void {
  }

  registerForm = this.formBuilder.group({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])),
    password: new FormControl('', Validators.required),
    ageGroup: '',
    education: '',
    gender: '',
    name: '',
  });

  async onSubmitRegister() {
    if(this.registerForm.value.username === null || this.registerForm.value.email === null || this.registerForm.value.password === null || this.registerForm.value.education === null || this.registerForm.value.gender === null || this.registerForm.value.name === null){
      this.error = true;
      this.errorMessage = 'Az összes mező kitöltése kötelező!';
      return;
    }

    await this.authService.signUp(this.registerForm.value.username, this.registerForm.value.email, this.registerForm.value.password, this.registerForm.value.ageGroup, this.registerForm.value.education, this.registerForm.value.name, 'true', this.registerForm.value.gender)
    .then(() => {
      this.registerForm.reset();
      this.router.navigateByUrl('/login');
    })
    .catch(error => {
      this.registerForm.reset();
      this.error = true;
      this.errorMessage = error;
    });
  }

}
