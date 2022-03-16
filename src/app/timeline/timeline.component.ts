import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'timeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'timeline.component.html',
  styleUrls: ['timeline.css'],
})
export class TimelineComponent implements OnChanges {
  @Input() reactionTimes : string[];
  container: HTMLElement;
  childDiv: HTMLElement;
  data: any[];
  
  constructor() { this.container = document.getElementById("timeline-container"); }

  ngOnChanges(changes: SimpleChanges): void {
    this.data = changes['reactionTimes'].currentValue;
  }
}
