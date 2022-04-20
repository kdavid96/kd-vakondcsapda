import { Component, OnInit, ViewChild } from '@angular/core';
import { GameDataService } from '../shared/game-data.service';
import { StatisticsComponent } from '../statistics/statistics.component';
import { Router } from '@angular/router';

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

  difficulty: string;
  level: number = 1;

  overlaySub;
  startedSub;
  loggedInSub;
  showGuideSub;

  constructor(private gameDataService: GameDataService, public router: Router) {
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
  }

  showStartingGuideChange(args){
    this.showStartingGuide = args;
  }

  ngOnInit(): void {
    this.overlaySub = this.gameDataService.currentStartOverlay.subscribe(value => this.startOverlay = value);
    this.startedSub = this.gameDataService.currentStarted.subscribe(value => this.started = value);
    this.loggedInSub = this.gameDataService.currentLoggedIn.subscribe(value => this.isLoggedIn = value);
    this.showGuideSub = this.gameDataService.currentStartOverlay.subscribe(value => this.showGuide = value);
  }

  ngOnDestroy(): void {
    this.overlaySub.unsubscribe();
    this.startedSub.unsubscribe();
    this.loggedInSub.unsubscribe();
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

  play(){
  }

}