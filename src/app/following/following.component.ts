import { Component, Input, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { size } from 'lodash';

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

  constructor(private authService: AuthService) {
    console.log(this.user);
    this.authService.getUserList().subscribe(
      (users) => {
        this.userList = users;
      }
    );
    //this.user.subscribe(user => console.log(user));
  }
}