import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'countdown',
  templateUrl: 'countdown.component.html',
  styleUrls: ['countdown.css'],
})
export class CountdownComponent implements OnInit {
  miliseconds = 0;
  @Output() outputTime = new EventEmitter();
  @Output() stop = new EventEmitter();
  startTime;
  endTime;
  obs;
  constructor() { }

  ngOnInit(): void { }


  start(): void {
    this.endTime = new Date();
    this.endTime.setSeconds(this.endTime.getSeconds() + 3000);
    var timeDiff;
    const obs$ = interval(10);
    this.obs = obs$.subscribe((d) => {
      this.startTime = new Date();
      timeDiff = this.endTime - this.startTime;
      if(-15 < timeDiff && timeDiff < 15){
        this.childStop();
        this.stop.emit();
      }
      timeDiff /= 1000;
      this.miliseconds = (this.endTime - this.startTime);  
      this.outputTime.emit({miliseconds: this.miliseconds});
    })
  }

  childStop(): void {
    this.startTime = new Date();
    this.endTime = new Date();
    this.obs.unsubscribe();
  }
}
