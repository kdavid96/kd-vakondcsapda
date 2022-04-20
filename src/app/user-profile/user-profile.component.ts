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

  followerCount: number;
  isFollowing: boolean = false;
  currentUser: any;
  followersObj: any;
  points: number = 0;
  userScoreList: [];

  followers;
  following;
  followersSub;
  followingSub;
  userSub;
  userResultSub;
  userScoreListSub;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user$.subscribe(user => this.currentUser = user);

    this.userResultSub = this.authService.getUserResults(this.user.data.uid);

    this.userScoreListSub = this.authService.userScoreList$.subscribe(userScoreList => userScoreList.map(res => {if(res.uid === this.user.data.uid) {this.points = res.score}else{this.points = 0}}));

    this.following = this.authService.getFollowing(this.currentUser.data.uid, this.user.data.uid).valueChanges();

    this.followingSub = this.following.subscribe(follow => this.isFollowing = follow);

    this.followers = this.authService.getFollowers(this.currentUser.data.uid).valueChanges();

    this.followersSub = this.followers.subscribe(followers => this.followersObj = followers);

    //this.authService.registerUser(this.currentUser);
  }

  private countFollowers(followers) {
    if (followers.$value===null) return 0
    else return size(followers)
  }


  toggleFollow() {
    const userId = this.user.data.uid;
    const currentUserId = this.currentUser.data.uid;
  
    if(this.user.data.uid === this.currentUser) return

    this.isFollowing ? this.authService.unfollow(currentUserId, userId) : this.authService.follow(currentUserId, userId)
  }


  ngOnDestroy() {
    if(this.followingSub) this.followingSub.unsubscribe();
    if(this.userSub) this.userSub.unsubscribe();
    if(this.userScoreListSub) this.userScoreListSub.unsubscribe();
  }

}
