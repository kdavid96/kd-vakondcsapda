import { Component, OnInit, ViewChild } from '@angular/core';
import { GameDataService } from '../shared/game-data.service';
import { StatisticsComponent } from '../statistics/statistics.component';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'game-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.css'],
})
export class MenuComponent implements OnInit {
  @ViewChild(StatisticsComponent) childStatistics:StatisticsComponent;

  statistics: boolean = false;
  tables: boolean = false;
  dataProtection: boolean = false;
  loggedInUser: any = null;
  started: boolean = false;
  isLoggedIn: boolean = false;
  isCookieVisible: boolean = false;
  showStartingGuide: boolean = true;
  isProfileOverlayOpen: boolean = false;
  startOverlay: boolean = true;
  showGuide: boolean = true;
  user: any;
  bestFollowingResult: any;
  userList: any;

  difficulty: string;
  level: number = 1;

  overlaySub;
  startedSub;
  loggedInSub;
  showGuideSub;
  userSub;
  bestFollowingResultSub;
  userListSub;

  constructor(private gameDataService: GameDataService, public router: Router, private authService: AuthService) {
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
  }

  showStartingGuideChange(args){
    this.showStartingGuide = args;
  }

  ngOnInit(): void {
    this.userListSub = this.authService.getUserList().subscribe(userList => this.userList = userList);
    this.overlaySub = this.gameDataService.currentStartOverlay.subscribe(value => this.startOverlay = value);
    this.startedSub = this.gameDataService.currentStarted.subscribe(value => this.started = value);
    this.loggedInSub = this.gameDataService.currentLoggedIn.subscribe(value => {this.isLoggedIn = value});
    this.showGuideSub = this.gameDataService.currentStartOverlay.subscribe(value => this.showGuide = value);
    this.userSub = this.authService.getUser().subscribe(user => {this.user = user.data; if(this.isLoggedIn) this.loadBestFollowingResult()});
    this.bestFollowingResultSub = this.authService.bestFollowingResult$.subscribe(bestFollowingResult => {
      this.bestFollowingResult = bestFollowingResult;
      if(this.userList && this.isLoggedIn){
        let tempId = this.bestFollowingResult.id;
        this.bestFollowingResult.id = this.userList.filter((user:any) => user.data.uid === tempId)[0].data.username;
      }
    });
  }

  ngOnDestroy(): void {
    this.userListSub.unsubscribe();
    this.overlaySub.unsubscribe();
    this.startedSub.unsubscribe();
    this.loggedInSub.unsubscribe();
    this.showGuideSub.unsubscribe();
    this.userSub.unsubscribe();
    this.bestFollowingResultSub.unsubscribe();
  }

  isClickedEvent(args){
    if(!this.isLoggedIn || !args){
      this.isCookieVisible = true;
      this.showStartingGuide = true;
    }
  }

  setLevelDifficulty(object){
    this.level = object.level;
    this.difficulty = object.difficulty;
  }

  setStarted(value){
    if(value){
      this.gameDataService.changeStarted(value);
    }
  }

  loadCharts() {
    this.childStatistics.loadHitsPerSecondsChart();
  }

  loadBestFollowingResult() {
    if(this.user){
      this.authService.loadBestFollowingResult(this.user.uid);
    }
  }

  play(){
  }

}