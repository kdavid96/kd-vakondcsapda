import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations'
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'starting-guide',
  templateUrl: 'starting-guide.component.html',
  styleUrls: ['starting-guide.css'] 
})
export class StartingGuideComponent implements OnInit {
  @Input() showStartingGuide: boolean; 
  @Output() showStartingGuideChange = new EventEmitter<boolean>();
  
  constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
    const userCookie = this.cookieService.get('permissionGranted');
    if(userCookie){
      this.changeStartingGuide();
    }
  }

  changeStartingGuide(): void {
    this.showStartingGuideChange.emit(false);
  }

  animate(number): void {
    document.getElementById(number).classList.add('animate');
  }

}
