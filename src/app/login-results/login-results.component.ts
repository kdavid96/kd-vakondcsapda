import { Component, OnInit } from '@angular/core';
import { GameDataService } from '../shared/game-data.service';
import { ReactionTimeServiceService } from '../shared/reaction-time-service.service';

@Component({
  selector: 'login-results',
  templateUrl: 'login-results.component.html',
  styleUrls: ['login-results.css'],
})
export class LoginResultsComponent implements OnInit {

  resultsArray = [];

  constructor(private reactionTimeService: ReactionTimeServiceService, private dataService: GameDataService) { }

  lastLoginSub;

  ngOnInit(): void {
    this.reactionTimeService.getLastReactions();
    this.dataService.currentLastResultsList.subscribe(value => {this.resultsArray = value; if(this.resultsArray.length === 0) this.continue();});
  }

  continue(): void {
    this.dataService.changeResultsShow(false);
  }
}
