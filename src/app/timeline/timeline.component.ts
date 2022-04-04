import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { TimelinePipe } from '../pipes/timeline.pipe';

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
  time: any;
  pipedTime: string;
  
  constructor(private pipe: TimelinePipe) { this.container = document.getElementById("timeline-container"); }

  ngOnChanges(changes: SimpleChanges): void {
    this.data = changes['reactionTimes'].currentValue;
    this.time = this.data[this.data.length - 1];
    this.pipedTime = this.pipe.transform(this.time);
    let box = document.createElement('li');
    box.innerHTML = this.pipedTime;
    var random_boolean = Math.random() < 0.5;
    if(random_boolean){
      box.classList.add("timeline-entry-right");
    }else{
      box.classList.add("timeline-entry-left");
    }
    if(this.time?.hit){
      box.style.color = 'green';
    }else{
      box.style.color = 'red';
    }
    document.getElementById("time-container").appendChild(box);
  }
}
