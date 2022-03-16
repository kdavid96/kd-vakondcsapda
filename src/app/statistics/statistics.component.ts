import { Component, OnInit } from '@angular/core';
import { ReactionTimeServiceService } from '../shared/reaction-time-service.service';
import { Chart, BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale} from 'chart.js';


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

  constructor(private reactionTimeService: ReactionTimeServiceService) {
    Chart.register(BarElement, BarController, CategoryScale, Decimation, Filler, Legend, Title, Tooltip, LinearScale);
  }

  ngOnInit(): void {
    this.canvas = <HTMLCanvasElement> document.getElementById('myChart');
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.ctxChart = this.canvas.getContext('2d');
  }

  loadHitsPerSecondsChart() {
    this.reactionTimeService.getReactionTimeResults().subscribe(result => {
      this.resultsArray = result.map(res => res.data.map(data => data.miliseconds));
      this.resultsArray = this.resultsArray.map(res => res.reduce((a,b) => a+b));
      this.resultsArray = this.resultsArray.map((res, index) => ({sum: res, length: result[index].data.length}));
      this.resultsArray = this.resultsArray.map((res, index) => ({...res, hits: result[index].data.filter(a => a.hit ).length}))
    })
    const colors = this.resultsArray.map(res => this.generateRandomColor());
    const borderColors = colors.map(color => color);
    this.myChart = new Chart(this.ctxChart, {
        type: 'bar',
        data: {
            labels: this.resultsArray.map(res => res.sum),
            datasets: [{
                label: '# of hits/sec',
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
    this.reactionTimeService.getReactionTimeResults().subscribe(result => {
      this.resultsArray = result.map(res => res.data.map(data => data.miliseconds));
      this.resultsArray = this.resultsArray.map(res => res.reduce((a,b) => a+b));
      this.resultsArray = this.resultsArray.map((res, index) => ({sum: res, length: result[index].data.length}));
      this.resultsArray = this.resultsArray.map((res, index) => ({...res, hits: result[index].data.filter(a => a.hit ).length}))
    })
    const colors = this.resultsArray.map(res => this.generateRandomColor());
    const borderColors = colors.map(color => color);
    this.myChart = new Chart(this.ctxChart, {
        type: 'bar',
        data: {
            labels: this.resultsArray.map(res => res.sum),
            datasets: [{
                label: '# of hits/game',
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
