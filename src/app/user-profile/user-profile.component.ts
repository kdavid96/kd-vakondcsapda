import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { size } from 'lodash';

@Component({
  selector: 'user-profile',
  templateUrl: 'user-profile.component.html',
  styleUrls: ['user-profile.css'],
})
export class UserProfileComponent implements OnInit {

  @Input() user;
  @Input() currentUser;

  followerCount: number;
  isFollowing: boolean = false;

  followers;
  following;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.following = this.authService.getFollowing(this.currentUser, this.user.data.uid).valueChanges();

    this.following.subscribe(follow => this.isFollowing = follow);

    this.authService.registerUser(this.currentUser);
  }

  private countFollowers(followers) {
    if (followers.$value===null) return 0
    else return size(followers)
  }


  toggleFollow() {
    const userId = this.user.data.uid
    const currentUserId = this.currentUser
  
    if(this.user.data.uid === this.currentUser) return

    this.isFollowing ? this.authService.unfollow(currentUserId, userId) : this.authService.follow(currentUserId, userId)
  }


  ngOnDestroy() {
    if(this.followers) this.followers.unsubscribe()
    if(this.following) this.following.unsubscribe()
  }

}
