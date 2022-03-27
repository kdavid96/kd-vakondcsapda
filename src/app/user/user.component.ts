import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.css']
})
export class UserComponent implements OnInit {
  @Input() isProfileOverlayOpen: boolean;
  @Output() outputProfileOverlayOpen : EventEmitter<boolean> = new EventEmitter();
  isRegistering: boolean = false;
  isLoggingIn: boolean = false;

  ageGroups: string[] = ['0-2', '20-40', '40-60', '60-80', '80-'];
  educationList: string[] = ['Nincs', 'Általános iskola', 'Szakmunkásképző', 'Érettségi', 'Diploma', 'PhD'];

  constructor(private formBuilder: FormBuilder) { }

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
    username: '',
    password: ''
  });

  ngOnInit(): void {
  }

  clearForm(): void {
    this.loginForm.reset();
    this.registerForm.reset();
  }

  sendDataToParent() {
    this.outputProfileOverlayOpen.emit(!this.isProfileOverlayOpen);
  }

  onSubmitLogin(): void {
    console.log('Your login has been submitted', this.loginForm.value);
    this.loginForm.reset();
    this.isLoggingIn = false;
  }

  onSubmitRegister(): void {
    console.log('Your registration has been submitted', this.registerForm.value);
    this.registerForm.reset();
    this.isRegistering = false;
  }

}
