import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'following',
  templateUrl: 'following.component.html',
  styleUrls: ['following.css'],
})
export class FollowingComponent {
  @Input() user: any;
  userId:any;
  userList:any;
  followers:any;
  followerCount:any;
  isFollowing:boolean = false;

  userSub;
  userListSub;

  constructor(private authService: AuthService) {
    this.userSub = this.authService.user$.subscribe((user) => this.user = user);
    this.userListSub = this.authService.getUserList().subscribe(
      (users) => {
        if(this.user){
          if(!this.user.data){
            let tempUser;
            this.user.subscribe(user => {tempUser = user;})
            this.userList = users.filter(user => user.data.uid !== tempUser.uid).filter(user => user.data.isPublic === "true");
          }else{
            this.userList = users.filter(user => user.data.uid !== this.user.data.uid).filter(user => user.data.isPublic === "true");
          }
        }else{
          this.userList = users.fulter(user => user.data.isPublic === "true");
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.userListSub.unsubscribe();
  }
}