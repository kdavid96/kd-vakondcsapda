import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'starting-guide',
  templateUrl: 'starting-guide.component.html',
  styleUrls: ['starting-guide.css'] 
})
export class StartingGuideComponent implements OnInit {
  @Input() showStartingGuide: boolean; 
  @Output() showStartingGuideChange = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void { }

  changeStartingGuide(): void {
    this.showStartingGuideChange.emit(false);
  }

}
