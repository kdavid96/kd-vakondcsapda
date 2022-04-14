import { Component, OnInit } from '@angular/core';
import { ReactionTimeServiceService } from '../shared/reaction-time-service.service';
import { Chart, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale} from 'chart.js';
import { map } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'statistics',
  templateUrl: 'statistics.component.html',
  styleUrls: ['statistics.css']
})
export class StatisticsComponent implements OnInit {
  resultsArray: any[] = [];
  single: any[];
  view: [number,number] = [500, 400];
  legend: boolean = false;
  legendPosition: any = 'below';
  canvas: HTMLCanvasElement;
  ctxChart: any;
  myChart: Chart;
  userList: any;

  constructor(private reactionTimeService: ReactionTimeServiceService, private authService: AuthService) {
    Chart.register(BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale);
    this.authService.getUserList().subscribe(userList => this.userList = userList, this.getResults());
  }

  ngOnInit(): void {
    this.canvas = <HTMLCanvasElement> document.getElementById('myChart');
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.ctxChart = this.canvas.getContext('2d');
    this.destroy();
    this.loadHitsPerSecondsChart();
  }

  getResults(): any{
    this.reactionTimeService.getReactionTimeResultsRealtime().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          //@ts-ignore
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      let localArray:any;
      if(this.userList){
        this.resultsArray = data.map(game => ({'id': game.id, 'difficulty': game.difficulty, 'date': game.date,'sum': Math.ceil(game.data?.map(data => data.miliseconds).reduce((a,b) => a+b)/1000), 'hits': game.data?.filter(a => a.hit ).length, 'misses': game.data?.filter(a => !a.hit).length, 'points': game.points}));
        this.resultsArray.forEach((data,index) => {
          this.resultsArray[index].id = this.userList.filter(user => user.data.uid === data.id)[0].data.username;
        })
      }
    });
  }

  loadHitsPerSecondsChart() {
    const colors = this.resultsArray.map(res => this.generateRandomColor());
    const borderColors = colors.map(color => color);
    this.myChart = new Chart(this.ctxChart, {
        type: 'bar',
        data: {
            labels: this.resultsArray.map(res => res.sum),
            datasets: [{
                label: 'találat/mp',
                data: this.resultsArray.map(res => (res.sum/1000)/res.hits),
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  }

  loadHitsPerGameChart() {    
    const colors = this.resultsArray.map(res => this.generateRandomColor());
    const borderColors = colors.map(color => color);
    this.myChart = new Chart(this.ctxChart, {
        type: 'bar',
        data: {
            labels: this.resultsArray.map(res => res.sum),
            datasets: [{
                label: 'találat/játék',
                data: this.resultsArray.map(res => res.hits),
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
  }

  generateRandomColor(){
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }

  destroy(){
    if(this.myChart){
      this.myChart.destroy();
    }
  }
}
