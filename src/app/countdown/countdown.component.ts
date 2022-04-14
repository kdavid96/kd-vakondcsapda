import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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
  @Input() duration = 0;
  startTime;
  endTime;
  obs;
  constructor() { }

  ngOnInit(): void { }


  start(): void {
    //this.endTime = new Date();
    this.endTime = performance.now();
    this.endTime += (this.duration*15)*1000;
    var timeDiff;
    const obs$ = interval(10);
    this.obs = obs$.subscribe((d) => {
      this.startTime = performance.now();
      timeDiff = this.endTime - this.startTime;
      if(-15 < timeDiff && timeDiff < 15){
        this.childStop();
        this.stop.emit();
      }
      timeDiff /= 1000;
      this.miliseconds = parseInt((this.endTime - this.startTime).toFixed(0));
      this.outputTime.emit({miliseconds: this.miliseconds});
    })
  }

  childStop(): void {
    this.startTime = new Date();
    this.endTime = new Date();
    this.obs.unsubscribe();
  }
}
