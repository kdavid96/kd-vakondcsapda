import { Component, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { map, tap } from 'rxjs';
import { ReactionTimeServiceService } from '../shared/reaction-time-service.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'tables',
  templateUrl: 'tables.component.html',
  styleUrls: ['tables.css']
})
export class TablesComponent implements OnInit, AfterViewInit {
  resultsArray: any[] = [];
  userList: any;
  displayedColumns: string[] = ['id', 'date', 'difficulty', 'sum', 'hits', 'misses', 'points'];
  pageSizeOptions: number[] = [5, 10, 20];
  pageSizeDefault: number = 10;
  dataSource;
  small: boolean = false;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  
  @ViewChild(MatSort) sort: MatSort;

  nameFilter = new FormControl('');
  difficultyFilter = new FormControl('');

  filterValues = {
    id: '',
    difficulty: ''
  };

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if(!event){
      if(window.innerWidth > 900){
        this.pageSizeDefault = 10;
        this.small = false;
        this.pageSizeOptions = [5, 10, 20];
        this.loadReactionTimes();
      }
      if(window.innerWidth < 900){
        this.pageSizeDefault = 1;
        this.small = true;
        this.pageSizeOptions = [1];
        this.loadReactionTimes();
      }
    }else{
      if(event.target.innerWidth > 900){
        this.pageSizeDefault = 10;
        this.small = false;
        this.pageSizeOptions = [5, 10, 20];
        this.loadReactionTimes();
      }
      if(event.target.innerWidth < 900){
        this.pageSizeDefault = 1;
        this.small = true;
        this.pageSizeOptions = [1];
        this.loadReactionTimes();
      }
    }

  }

  constructor(private reactionTimeService: ReactionTimeServiceService, private authService: AuthService) {
    this.authService.getUserList().subscribe(userList => {
      this.userList = userList,
      this.loadReactionTimes()
    });
    this.onResize();
  }

  ngOnInit(): any {}

  formatDate(date){
    var [datePart, timePart] = date.split('T');
    var returnString = datePart.split('-')[0] + "." + datePart.split('-')[1] + "." + datePart.split('-')[2] + " " + timePart.split(':')[0] + ":" + timePart.split(':')[1] + ":" + timePart.split(':')[2].split('.')[0];
    return returnString;
  }

  loadReactionTimes(): void {
    this.reactionTimeService.getReactionTimeResultsRealtime().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          //@ts-ignore
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.resultsArray = data.map(game => ({
        'id': game.id,
        'difficulty': game.difficulty,
        'date': this.formatDate(new Date(game.date).toISOString()),
        'sum': Math.ceil(game.data.map(data => data.miliseconds).reduce((a,b) => a+b)/1000),
        'hits': game.data.filter(a => a.hit ).length,
        'misses': game.data.filter(a => !a.hit).length,
        'points': game.points
      }));
      if(this.userList && this.userList.length>0){
        this.resultsArray.forEach((data,index) => {
          this.resultsArray[index].id = this.userList.filter(user => user.data.uid === data.id)[0].data.username;
        })  
      }
      
      if(this.resultsArray.length === 0) {
        this.displayedColumns = ['.'];
        this.resultsArray.push({'sum': 'Jelenleg nincsenek megjeleníthető adatok!'});
      }

      this.dataSource = new MatTableDataSource(this.resultsArray);
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Elemek száma oldalanként:';
      this.paginator._intl.nextPageLabel = 'Következő oldal';
      this.paginator._intl.previousPageLabel = 'Előző oldal';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        const start = page * pageSize + 1;
        const end = length < (page + 1) * pageSize ? length : (page + 1) * pageSize;
        return `${start} - ${end} a ${length}-ból`;
      };
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = this.createFilter();
    });

    this.nameFilter.valueChanges
      .subscribe(
        id => {
          this.filterValues.id = id.toLowerCase();
          this.dataSource.filter = JSON.stringify(this.filterValues);
        }
      )
    this.difficultyFilter.valueChanges
      .subscribe(
        difficulty => {
          switch(difficulty){
            case 'könnyű': this.filterValues.difficulty = 'easy';this.dataSource.filter = JSON.stringify(this.filterValues);break;
            case 'közepes': this.filterValues.difficulty = 'medium';this.dataSource.filter = JSON.stringify(this.filterValues);break;
            case 'nehéz': this.filterValues.difficulty = 'hard';this.dataSource.filter = JSON.stringify(this.filterValues);break;
            default: this.filterValues.difficulty = difficulty;this.dataSource.filter = JSON.stringify(this.filterValues);break;
          }
        }
      )


  }
  
  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.id.toString().toLowerCase().indexOf(searchTerms.id) !== -1
        && data.difficulty.toLowerCase().indexOf(searchTerms.difficulty) !== -1;
    }
    return filterFunction;
  }

  ngAfterViewInit(): void {
    this.paginator.page
    .pipe(
      tap(() => this.loadReactionTimes())
    )
    .subscribe();
    
    this.loadReactionTimes();
  }

}
