import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'edit-profile',
  templateUrl: 'edit-profile.component.html',
  styleUrls: ['edit-profile.css']
})
export class EditProfileComponent implements OnInit {
  error: boolean = false;
  errorMessage: string = '';

  ageGroups: string[] = ['0-20', '20-40', '40-60', '60-80', '80-'];
  educationList: string[] = ['Nincs', 'Általános iskola', 'Szakmunkásképző', 'Érettségi', 'Diploma', 'PhD'];
  
  editForm = this.formBuilder.group({
    usernameEdit: new FormControl('', Validators.required),
    emailEdit: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ])),
    passwordEdit: new FormControl('', Validators.required),
    passwordReEdit: new FormControl('', Validators.required),
    ageGroupEdit: '',
    educationEdit: '',
    genderEdit: '',
    nameEdit: '',
  });
  
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }
  
  saveData() {
    console.log('saving data');
  }

}
