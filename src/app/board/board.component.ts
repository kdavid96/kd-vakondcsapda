import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { COLS, ROWS, BLOCK_SIZE} from '../constants';
import { CountdownComponent } from '../countdown/countdown.component';
import { TimelineComponent } from '../timeline/timeline.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { ReactionTimeServiceService } from '../shared/reaction-time-service.service';
import { Square } from './square';


@Component({
  selector: 'game-board',
  templateUrl: 'board.component.html',
  styleUrls: ['board.css'],
})
export class BoardComponent implements OnInit {
  // Canvas-re mutató referencia
  @ViewChild("board", { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild(CountdownComponent) childCountdown:CountdownComponent;
  @ViewChild(StatisticsComponent) childStatistics:StatisticsComponent;

  ctx: CanvasRenderingContext2D;
  points: number = 0;
  moles: number = 0;
  level: number = 1;
  direction: number;
  roadPlace: number;
  roadCoordinate: number = 0;
  board: number[][];
  reactionTimes: any[] = [];
  squares: Array<Square> = [];
  log;
  log_dir;
  x: number = 0;
  y: number = 0;
  miliseconds: number;
  loaded: boolean = false;
  started: boolean = false;
  dataProtection: boolean = false;
  statistics: boolean = false;
  molePosition: number = 0;
  otherButton: boolean = true;
  startOverlay: boolean = true;
  startCountdown: boolean = false;
  showStartingGuide: boolean = false;
  beginningCountdown: HTMLElement;
  count: number = 3;
  timer: any;
  xPos: any;
  yPos: any;
  offsetX: any;
  offsetY: any;

  constructor(private reactionTimeService: ReactionTimeServiceService) {}

  ngOnInit(): void {
    this.initBoard();
    if(this.isTouchEnabled()){
      console.log("VAN TOUCHSCREEN");
      this.setUpTouch();
    }else{
      console.log("NINCS TOUCH SCREEN");
      document.addEventListener('keydown', this.logKey);
    }
  }

  isTouchEnabled(): any {
    return ( 'ontouchstart' in window ) || ( navigator.maxTouchPoints > 0 );
  }

  setUpTouch(): void {
    var el = document.getElementById("board");
    el.addEventListener("touchstart", this.handleStart.bind(this), false);
    el.addEventListener("touchend", this.handleEnd.bind(this), false);
    el.addEventListener("touchcancel", this.handleCancel.bind(this), false);
    el.addEventListener("touchmove", this.handleMove.bind(this), false);
  }

  handleStart(evt): void {
    var el = document.getElementById("board");
    var rect = el.getBoundingClientRect();
    this.xPos = evt.targetTouches[0].screenX - rect.left;
    this.yPos = evt.targetTouches[0].screenY - rect.top;
  }

  handleEnd(evt): void {
    var el = document.getElementById("board");
    var rect = el.getBoundingClientRect();
    this.xPos = evt.changedTouches[0].clientX - rect.left;
    this.yPos = evt.changedTouches[0].clientY - rect.top;
    //ablak atmeretezes eseten is helyes az utpozicio
    this.roadCoordinate = (this.roadPlace+1) * (rect.width / 11);

    if(this.direction){
      //0 = fent, 1 = lent, 2 = bal, 3 = jobb
      //itt vizszintes az ut
      if(this.molePosition === 0){
        if(this.roadCoordinate > this.yPos){
          this.reactionTimes.push(this.timeSpent(this.miliseconds, true));
          this.reactionTimes = this.reactionTimes.slice();
          this.points++;
          this.moles++;
          this.blinkGreen();
        }else{
          this.reactionTimes.push(this.timeSpent(this.miliseconds, false));
          this.reactionTimes = this.reactionTimes.slice();
          this.points*=0.9;
          this.blinkRed();
        }
      }else{
        if(this.roadCoordinate < this.yPos){
          this.reactionTimes.push(this.timeSpent(this.miliseconds, true));
          this.reactionTimes = this.reactionTimes.slice();
          this.points++;
          this.moles++;
          this.blinkGreen();
        }else{
          this.reactionTimes.push(this.timeSpent(this.miliseconds, false));
          this.reactionTimes = this.reactionTimes.slice();
          this.points*=0.9;
          this.blinkRed();
        }
      }
    }else{
      //itt fuggoleges az ut
      if(this.molePosition === 2){
        if(this.roadCoordinate > this.xPos){
          this.reactionTimes.push(this.timeSpent(this.miliseconds, true));
          this.reactionTimes = this.reactionTimes.slice();
          this.points++;
          this.moles++;
          this.blinkGreen();
        }else{
          this.reactionTimes.push(this.timeSpent(this.miliseconds, false));
          this.reactionTimes = this.reactionTimes.slice();
          this.points*=0.9;
          this.blinkRed();
        }
      }else{
        if(this.roadCoordinate < this.xPos){
          this.reactionTimes.push(this.timeSpent(this.miliseconds, true));
          this.reactionTimes = this.reactionTimes.slice();
          this.points++;
          this.moles++;
          this.blinkGreen();
        }else{
          this.reactionTimes.push(this.timeSpent(this.miliseconds, false));
          this.reactionTimes = this.reactionTimes.slice();
          this.points*=0.9;
          this.blinkRed();
        }
      }
    }
    this.points = parseFloat(this.points.toFixed(2));
    this.regenerateBoard();
  }
  handleCancel(evt): void {
    console.log("cancel" + evt.changedTouches);
  }
  handleMove(evt): void {
    console.log("move" + evt.changedTouches);
  }

  logKey = (e) => {
    if(this.started){
      this.otherButton = true;
      //0 = fent, 1 = lent, 2 = bal, 3 = jobb
      // 38 = fent, 40 = lent, 37 = bal, 39 = jobb
      if(e.keyCode === 37){
        this.otherButton = false;
        if(this.molePosition === 2) {
          this.reactionTimes.push(this.timeSpent(this.miliseconds, true));
          this.reactionTimes = this.reactionTimes.slice();
          this.points++;
          this.moles++;
          this.blinkGreen();
        } else {
          this.reactionTimes.push(this.timeSpent(this.miliseconds, false));
          this.reactionTimes = this.reactionTimes.slice();
          this.points*=0.9;
          this.blinkRed();
        }
      }
      if(e.keyCode === 38){
        this.otherButton = false;
        if(this.molePosition === 0) {
          this.reactionTimes.push(this.timeSpent(this.miliseconds, true));
          this.reactionTimes = this.reactionTimes.slice();
          this.points++;
          this.moles++;
          this.blinkGreen();
        } else {
          this.reactionTimes.push(this.timeSpent(this.miliseconds, false));
          this.reactionTimes = this.reactionTimes.slice();
          this.points*=0.9;
          this.blinkRed();
        }
      }
      if(e.keyCode === 39){
        this.otherButton = false;
        if(this.molePosition === 3) {
          this.reactionTimes.push(this.timeSpent(this.miliseconds, true));
          this.reactionTimes = this.reactionTimes.slice();
          this.points++;
          this.moles++;
          this.blinkGreen();
        } else {
          this.reactionTimes.push(this.timeSpent(this.miliseconds, false));
          this.reactionTimes = this.reactionTimes.slice();
          this.points*=0.9;
          this.blinkRed();
        }
      }
      if(e.keyCode === 40){
        this.otherButton = false;
        if(this.molePosition === 1) {
          this.reactionTimes.push(this.timeSpent(this.miliseconds, true));
          this.reactionTimes = this.reactionTimes.slice();  
          this.points++;
          this.moles++;
          this.blinkGreen();
        } else {
          this.reactionTimes.push(this.timeSpent(this.miliseconds, false));
          this.reactionTimes = this.reactionTimes.slice();
          this.points*=0.9;
          this.blinkRed();
        }
      }
      this.points = parseFloat(this.points.toFixed(2));
      if(!this.otherButton){
        this.regenerateBoard();
      }
    }
  };

  timeSpent(miliseconds, hit) {
    if(this.reactionTimes.length === 0){
      return {miliseconds: 30000 - miliseconds, hit: hit}
    } else {
      let tempMiliseconds = this.reactionTimes.reduce((partialSum, a) => partialSum + a.miliseconds, 0);
      return {miliseconds: 30000 - tempMiliseconds - miliseconds, hit}
    }
  }

  displayTimer($event) {
    this.miliseconds = $event.miliseconds;
  }

  initBoard() {
    // 2D context importálása
    const ctxTry = this.canvas.nativeElement.getContext("2d");
    if (!ctxTry || !(ctxTry instanceof CanvasRenderingContext2D)) {
        throw new Error('Failed to get 2D context');
    }
    // méret kalkulálása
    ctxTry.canvas.width = COLS * BLOCK_SIZE;
    ctxTry.canvas.height = ROWS * BLOCK_SIZE;

    //háttér textúrák betöltése
    var background = new Image();
    var house = new Image();
    var road = new Image();
    var localDirection;
    this.direction = Math.floor(Math.random() * 2);
    this.roadPlace = Math.floor(Math.random() * 9) + 1;

    localDirection = this.direction;
    if(!this.loaded){
      window.onload = function(){
        background = document.getElementById("grass") as HTMLImageElement;
        house = document.getElementById("house") as HTMLImageElement;
        road = document.getElementById("road") as HTMLImageElement;
        //fű kirajzolása        
        for (var i = 0; i < 11; i++) {
          for (var j = 0; j < 11; j++) {
              ctxTry.drawImage(background, j * 40, i * 40, 40, 40);
          }
        }
  
        //csak 5*blokkszélesség mert az első 0, ha 0 akkor vizszintes az út
        if(localDirection === 0){
          for(var i=0; i<11; i++){
          ctxTry.drawImage(road, i*BLOCK_SIZE, this.roadPlace*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          }
          ctxTry.drawImage(house, 0, this.roadPlace*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          ctxTry.drawImage(house, 10*BLOCK_SIZE, this.roadPlace*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }else{
          for(var i=0; i<11; i++){
            ctxTry.drawImage(road, this.roadPlace*BLOCK_SIZE, i*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          }
          ctxTry.drawImage(house, this.roadPlace*BLOCK_SIZE, 0, BLOCK_SIZE, BLOCK_SIZE);
          ctxTry.drawImage(house, this.roadPlace*BLOCK_SIZE, 10*BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
      this.loaded = true;
    }else if(this.started){
      background = document.getElementById("grass") as HTMLImageElement;
      house = document.getElementById("house") as HTMLImageElement;
      road = document.getElementById("road") as HTMLImageElement;
      ctxTry.drawImage(background, 40, 40, 40, 40);
      //fű rajzolása
      for (var i = 0; i < 11; i++) {
        for (var j = 0; j < 11; j++) {
            ctxTry.drawImage(background, j * 40, i * 40, 40, 40);
        }
      }
  
      //csak 5*blokkszélesség mert az első 0, ha 0 akkor vizszintes az út
      if(localDirection === 0){
        for(var i=0; i<11; i++){
        ctxTry.drawImage(road, i*40, 5*40, 40, 40);
        }
        ctxTry.drawImage(house, 0, 5*40, 40, 40);
        ctxTry.drawImage(house, 10*40, 5*40, 40, 40);
      }else{
        for(var i=0; i<11; i++){
          ctxTry.drawImage(road, 5*40, i*40, 40, 40);
          }
        ctxTry.drawImage(house, 5*40, 0, 40, 40);
        ctxTry.drawImage(house, 5*40, 10*40, 40, 40);
      }
    }

    //context átadása
    this.ctx = ctxTry;
  }

  play() {
    this.points = 0;
    this.moles = 0;
    this.started = true;
    this.startOverlay = true;
    this.startCountdown = true;
    let count = this.count;

    this.beginningCountdown = document.getElementById("beginning-countdown");
    let beginningCountdown = this.beginningCountdown;

    let timer = setInterval(function() {
      count--;
      beginningCountdown.innerHTML = count.toString();
      if(count === 0){
        clearInterval(timer);
        count = 3;
        beginningCountdown.innerHTML = count.toString();
      }
    }, 1000);

    setTimeout(() => {
      this.startCountdown = false;
      this.startOverlay = false;
      //user jatekter inicializalasa nullakkal
      this.childCountdown.start();
      this.board = this.getEmptyBoard();
      this.direction = Math.floor(Math.random() * 2);
      this.roadPlace = Math.floor(Math.random() * 9) + 1;
      this.roadCoordinate = (this.roadPlace+1) * BLOCK_SIZE;

      console.log('roadCoordinate: ', this.roadCoordinate);
      var x,y;
      [x,y] = this.generateMolePosition(this.roadPlace,this.direction);
      new Square(this.ctx).draw(x,y,this.roadPlace,this.direction);
      
      //feltoltom a tileok tombjet majd kirajzolom
      this.squares.forEach((square, index) => {
        setTimeout(this.drawEverything,index * 1000, square, index, index, this.roadPlace, this.direction)
      });
    }, 3000)
  }

  removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
  }

  regenerateBoard() {
    this.board = this.getEmptyBoard();
    this.direction = Math.floor(Math.random() * 2);
    this.roadPlace = Math.floor(Math.random() * 9) + 1;
    this.roadCoordinate = this.roadPlace * BLOCK_SIZE;

    var x,y;
    [x,y] = this.generateMolePosition(this.roadPlace,this.direction);

    new Square(this.ctx).draw(x,y,this.roadPlace,this.direction);

    this.squares.forEach((square, index) => {
      setTimeout(this.drawEverything,index * 1000, square, index, index, this.roadPlace, this.direction)
    });

  }
  
  generateMolePosition(roadPlace, direction){
    var x,y;
    //1 == bal/fent, 0 == jobb/lent
    var half = Math.floor(Math.random() * 2);
    if(half){
      //ha 1 akkor függőleges az út
      if(direction){
        x = this.randomIntFromInterval(0, 10);
        y = this.randomIntFromInterval(0, roadPlace - 1);
      }else{
        x = this.randomIntFromInterval(0, roadPlace - 1);
        y = this.randomIntFromInterval(0, 10);
      }
    }else{
      if(direction){
        x = this.randomIntFromInterval(0, 10);
        y = this.randomIntFromInterval(roadPlace + 1, 10);
      }else{
        x = this.randomIntFromInterval(roadPlace + 1, 10);
        y = this.randomIntFromInterval(0, 10);
      }
    }

    this.x = x;
    this.y = y;

    //0 = fent, 1 = lent, 2 = bal, 3 = jobb
    
    //TODO: VALAMIERT HA 10 A KOORDINATA, 0-RA RENDERELI ES IGY NYILVAN SZAR A TALALAT

    if(direction){
      if(y > roadPlace) this.molePosition = 1; else this.molePosition = 0;
      if(y === 10) this.molePosition = 0;
    }else{
      if(x > roadPlace) this.molePosition = 3; else this.molePosition = 2;
      if(x === 10) this.molePosition = 2;
    }

    return [x,y];
  }

  drawEverything(square,x,y,road,direction){
    square.draw(x,y,road,direction);
  }

  getEmptyBoard() {
    return Array.from({length: ROWS}, () => Array(COLS).fill(0));
  }
  
  getRandomInt() {
    return Math.floor(Math.random() * 11);
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  blinkRed(){
    document.getElementById("light").style.backgroundColor = "red";
    document.getElementById("light").style.width = "100%";
    setTimeout(() => this.setWhite(), 350);
  }

  blinkGreen(){
    document.getElementById("light").style.backgroundColor = "green";
    document.getElementById("light").style.width = "100%";
    setTimeout(() => this.setWhite(), 350);
  }

  setWhite(){
    document.getElementById("light").style.backgroundColor = "rgba(239,239,239,1)";
    document.getElementById("light").style.width = "0%";
  }

  stop() {
    console.log(this.reactionTimes);
    this.reactionTimeService.createReactionTimeResult(this.reactionTimes);
    this.reactionTimes = [];
    this.setWhite();
    this.childCountdown.childStop();
    this.started = false;
  }

  loadCharts() {
    this.childStatistics.loadHitsPerSecondsChart();
  }
}