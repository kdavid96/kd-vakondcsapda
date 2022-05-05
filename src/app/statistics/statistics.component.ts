import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReactionTimeServiceService } from '../shared/reaction-time-service.service';
import { Chart, BarElement, BarController, PieController, CategoryScale, ArcElement, Decimation, Filler, Legend, Title, Tooltip, LinearScale} from 'chart.js';
import { map } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'statistics',
  templateUrl: 'statistics.component.html',
  styleUrls: ['statistics.css']
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  resultsArray: any[] = [];
  resultsArrayExtended: any[] = [];
  single: any[];
  view: [number,number] = [500, 400];
  legend: boolean = false;
  legendPosition: any = 'below';
  canvas: HTMLCanvasElement;
  ctxChart: any;
  myChart: Chart;
  userList: any;
  currentUsername: any;
  selected: string = 'Válasszon a listából...'

  userSub;
  userListSub;

  constructor(private reactionTimeService: ReactionTimeServiceService, private authService: AuthService) {
    Chart.register(BarElement, BarController, PieController, CategoryScale, ArcElement, Decimation, Filler, Legend, Title, Tooltip, LinearScale);
    this.authService.getUserList().subscribe(userList => this.userList = userList, this.getResults(), this.loadHitsPerSecondsChart());
    this.userSub = this.authService.user$.subscribe(user => this.currentUsername = user.data?.username);
  }

  ngOnInit(): void {
    this.canvas = <HTMLCanvasElement> document.getElementById('myChart');
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.ctxChart = this.canvas.getContext('2d');
  }

  ngOnDestroy(): void {
  }

  ngAfterViewInit(): void {
    this.destroy();
  }

  loadOwnHitsPerSecondsChart(): any {
    this.selected = 'Saját statisztikák';
    let resultsArrayOwn = this.resultsArray.filter(res => res.id === this.currentUsername);
    const colors = resultsArrayOwn.map(res => this.generateRandomColor());
    const borderColors = colors.map(color => color);
    this.myChart = new Chart(this.ctxChart, {
        type: 'bar',
        data: {
            labels: resultsArrayOwn.map(res => res.sum),
            datasets: [{
                label: 'találat/mp',
                data: resultsArrayOwn.map(res => (res.sum/1000)/res.hits),
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

  getResults(): any{
    this.reactionTimeService.getReactionTimeResultsRealtime().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          //@ts-ignore
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      if(this.userList){
        this.resultsArray = data.map(game => ({'id': game.id, 'difficulty': game.difficulty, 'date': game.date,'sum': Math.ceil(game.data?.reduce((accumulator,object) => { return accumulator+object.miliseconds}, 0)), 'hits': game.data?.filter(a => a.hit ).length, 'misses': game.data?.filter(a => !a.hit).length, 'points': game.points}));
        this.resultsArray.forEach((data,index) => {
          this.resultsArray[index].id = this.userList.filter(user => user.data.uid === data.id)[0].data.username;
        });

        this.resultsArrayExtended = data.map(game =>({'id': game.id, 'difficulty': game.difficulty, 'date': game.date,'sum': Math.ceil(game.data?.reduce((accumulator,object) => { return accumulator+object.miliseconds}, 0)), 'hits': game.data?.filter(a => a.hit ).length, 'misses': game.data?.filter(a => !a.hit).length, 'points': game.points, 'education': '', 'ageGroup': ''}))
        this.resultsArrayExtended.forEach((data, index) => {
          this.resultsArrayExtended[index].education = this.userList.filter(user => user.data.uid === data.id)[0].data.education;
          this.resultsArrayExtended[index].ageGroup = this.userList.filter(user => user.data.uid === data.id)[0].data.ageGroup;
          this.resultsArrayExtended[index].id = this.userList.filter(user => user.data.uid === data.id)[0].data.username;
        })
      }
    });
  }

  loadHitsPerSecondsChart(): any {
    this.selected = 'Találatok másodpercenként';
    this.getResults();
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
    this.selected = 'Találatok játékonként';
    this.getResults(); 
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

  prepareAgeGroupArray() {
    let tempArray = this.resultsArrayExtended;
    let newResultsArrayExtended = this.resultsArrayExtended.reduce(function(arr, item){
      if(item.ageGroup === "0-20") arr[0] = {"0-20": tempArray.filter(item => item.ageGroup === "0-20")} || {"0-20": []};
      if(item.ageGroup === "20-40") arr[1] = {"20-40": tempArray.filter(item => item.ageGroup === "20-40")} || {"20-40": []};
      if(item.ageGroup === "40-60") arr[2] = {"40-60": tempArray.filter(item => item.ageGroup === "40-60")} || {"40-60": []};
      if(item.ageGroup === "60-80") arr[2] = {"60-80": tempArray.filter(item => item.ageGroup === "60-80")} || {"60-80": []};
      if(item.ageGroup === "80-") arr[2] = {"80-": tempArray.filter(item => item.ageGroup === "80-")} || {"80-": []};
      return arr;
    }, []);

    newResultsArrayExtended = newResultsArrayExtended
    this.resultsArrayExtended = newResultsArrayExtended;
  }

  sumAgeGroupData(data){
    let time = 0;
    let hits = 0;
    Object.values(data).map((entryArray:any) => {entryArray.map((entry:any) => {time += entry.sum, hits += entry.hits + entry.misses})});
    return {hits, time}
  }

  loadReactionTimePerAgeGroup() {
    this.selected = 'Reakcióidő korcsoportonként';
    const colors = this.resultsArrayExtended.map(res => this.generateRandomColor());
    const borderColors = colors.map(color => color);

    this.getResults();

    this.prepareAgeGroupArray();

    const reduced = this.resultsArrayExtended.map(ageGroup => this.sumAgeGroupData(ageGroup));

    this.myChart = new Chart(this.ctxChart, {
      type: 'bar',
      data: {
        labels: this.resultsArrayExtended.map((res, index) => {return Object.keys(res).map((key, index) => {return key})}),
        datasets: [{
          label: 'reakcióidő másodpercben',
          data: reduced.map(res => res.hits/(res.time/1000)),
          backgroundColor: colors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: {
      }
    })
  }

  prepareEducationArray() {
    this.selected = 'Reakcióidő végzettség szerint';
    let tempArray = this.resultsArrayExtended;

    let newResultsArrayExtended = this.resultsArrayExtended.reduce(function(arr, item){
      if(item.education === "Nincs") arr[0] = {"Nincs": tempArray.filter(item => item.education === "Nincs")} || {"Nincs": []};
      if(item.education === "Általános iskola") arr[1] = {"Általános iskola": tempArray.filter(item => item.education === "Általános iskola")} || {"Általános iskola": []};
      if(item.education === "Szakmunkásképző") arr[2] = {"Szakmunkásképző": tempArray.filter(item => item.education === "Szakmunkásképző")} || {"Szakmunkásképző": []};
      if(item.education === "Érettségi") arr[3] = {"Érettségi": tempArray.filter(item => item.education === "Érettségi")} || {"Érettségi": []};
      if(item.education === "Diploma") arr[4] = {"Diploma": tempArray.filter(item => item.education === "Diploma")} || {"Diploma": []};
      if(item.education === "PhD") arr[5] = {"PhD": tempArray.filter(item => item.education === "PhD")} || {"PhD": []};
      return arr;
    }, []);

    newResultsArrayExtended = newResultsArrayExtended
    this.resultsArrayExtended = newResultsArrayExtended;
  }

  sumEducationData(data){
    let time = 0;
    let hits = 0;
    Object.values(data).map((entryArray:any) => {entryArray.map((entry:any) => {time += entry.sum, hits += entry.hits + entry.misses})});
    return {hits, time}
  }

  loadReactionTimePerAgeEducation() {
    const colors = this.resultsArrayExtended.map(res => this.generateRandomColor());
    const borderColors = colors.map(color => color);

    this.getResults();

    this.prepareEducationArray();

    const reduced = this.resultsArrayExtended.map(education => this.sumEducationData(education));

    this.myChart = new Chart(this.ctxChart, {
      type: 'bar',
      data: {
        labels: this.resultsArrayExtended.map((res, index) => {return Object.keys(res).map((key, index) => {return key})}),
        datasets: [{
          label: 'reakcióidő másodpercben',
          data: reduced.map(res => res.hits/(res.time/1000)),
          backgroundColor: colors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
      }
    })
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
