import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations'
import { CookieService } from 'ngx-cookie-service';
import { GameDataService } from '../shared/game-data.service';

@Component({
  selector: 'starting-guide',
  templateUrl: 'starting-guide.component.html',
  styleUrls: ['starting-guide.css'] 
})
export class StartingGuideComponent implements OnInit, OnDestroy {
  @Input() showStartingGuide: boolean; 
  @Output() showStartingGuideChange = new EventEmitter<boolean>();

  constructor(private cookieService: CookieService, private dataService: GameDataService) { }

  keyUp(e): void{
    e.preventDefault();
    const parsedKey = e.key.toLowerCase().replace("\\", "\\\\");
    const parsedCode = e.code.toLowerCase();
    const element =
      document.querySelector(`[data-key="${parsedCode}"]`) ||
      document.querySelector(`[data-key="${parsedKey}"]`);

    if (element) {
      element.classList.remove("press");
    }
  }

  keyDown(e): void {
    e.preventDefault();
    const parsedKey = e.key.toLowerCase().replace("\\", "\\\\");
    const parsedCode = e.code.toLowerCase();
    const element =
      document.querySelector(`[data-key="${parsedCode}"]`) ||
      document.querySelector(`[data-key="${parsedKey}"]`);

    if (element) {
      element.classList.add("press");
    }
  }
  ngOnInit(): void {
    document.addEventListener('keydown', this.keyDown);

    document.addEventListener("keyup", this.keyDown);  
    const userCookie = this.cookieService.get('permissionGranted');
    if(userCookie){
      this.changeStartingGuide();
    }
  }

  changeStartingGuide(): void {
    this.showStartingGuideChange.emit(false);
    this.dataService.changeStartOverlay(false);
  }

  animate(number): void {
    document.getElementById(number).classList.add('animate');
  }

  ngOnDestroy(){
    document.removeEventListener('keydown', this.keyDown);
    document.removeEventListener('keyup', this.keyUp);
  }

}
