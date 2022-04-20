import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameDataService } from '../shared/game-data.service';

@Component({
  selector: 'side-toggle',
  templateUrl: 'side-toggle.component.html',
  styleUrls: ['side-toggle.css'],
})
export class SideToggleComponent implements OnInit {
  @Input() isProfileOverlayOpen: boolean;
  @Input() started: boolean;

  level: number = 1;
  difficulty: string = "easy";

  constructor(private dataService: GameDataService) { }

  ngOnInit(): void { }

  setDifficulty(string){
    this.difficulty = string;
    this.dataService.changeDifficulty(string);
  }

  setLevel(string){
    this.level = Math.floor(string);
    this.dataService.changeLevel(string)
  }

}
