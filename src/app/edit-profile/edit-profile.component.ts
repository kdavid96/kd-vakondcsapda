import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'edit-profile',
  templateUrl: 'edit-profile.component.html',
  styleUrls: ['edit-profile.css']
})
export class EditProfileComponent implements OnInit {
  error: boolean = false;
  errorMessage: string = '';
  user: any;


  ageGroups: string[] = ['0-20', '20-40', '40-60', '60-80', '80-'];
  educationList: string[] = ['Nincs', 'Általános iskola', 'Szakmunkásképző', 'Érettségi', 'Diploma', 'PhD'];
  
  editForm = this.formBuilder.group({
    usernameEdit: new FormControl('', Validators.required),
    ageGroupEdit: '',
    educationEdit: '',
    genderEdit: '',
    nameEdit: '',
    publicEdit: '',
  });

  userSub;
  
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.userSub = this.authService.getUser().subscribe(user => this.user = user);
    this.editForm.get('usernameEdit')?.setValue(this.user.data.username);
    this.editForm.get('educationEdit')?.setValue(this.user.data.education);
    this.editForm.get('nameEdit')?.setValue(this.user.data.name);
    this.editForm.get('ageGroupEdit')?.setValue(this.user.data.ageGroup);
    this.editForm.get('genderEdit')?.setValue(this.user.data.gender);
    this.editForm.get('publicEdit')?.setValue(this.user.data.isPublic);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  

  async onSubmitEdit() {
    if(this.editForm.value.usernameEdit === null || this.editForm.value.educationEdit === null || this.editForm.value.genderEdit === null || this.editForm.value.nameEdit === null || this.editForm.value.publicEdit === null){
      this.error = true;
      this.errorMessage = 'Az összes mező kitöltése kötelező!';
      return;
    }

    await this.authService.editProfile(this.editForm.value.usernameEdit, this.editForm.value.ageGroupEdit, this.editForm.value.educationEdit, this.editForm.value.nameEdit, this.editForm.value.publicEdit, this.user.data.uid)
    .then(() => {
      this.toast.success('A mentés sikeres');
    })
    .catch(error => {
      this.error = true;
      this.errorMessage = error;
      this.toast.error(error, 'Hiba!');      
    });
  }

}
