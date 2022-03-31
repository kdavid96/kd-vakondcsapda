import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { tap } from 'rxjs';
import { ReactionTimeServiceService } from '../shared/reaction-time-service.service';

@Component({
  selector: 'tables',
  templateUrl: 'tables.component.html',
  styleUrls: ['tables.css']
})
export class TablesComponent implements OnInit, AfterViewInit {
  resultsArray: any[] = [];
  displayedColumns: string[] = ['id', 'difficulty', 'sum', 'hits', 'misses'];
  dataSource;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  constructor(private reactionTimeService: ReactionTimeServiceService) { }

  ngOnInit(): void {
    this.loadReactionTimes();
  }

  loadReactionTimes(): void {
    this.reactionTimeService.getReactionTimeResults().subscribe(result => {
      this.resultsArray = result.map(game => ({'id': game.id, 'difficulty': game.difficulty, 'sum': game.data.map(data => data.miliseconds).reduce((a,b) => a+b), 'hits': game.data.filter(a => a.hit ).length, 'misses': game.data.filter(a => !a.hit).length}));
      console.log(this.resultsArray);
      console.log(result);
      if(this.resultsArray.length === 0) {
        this.displayedColumns = ['.'];
        this.resultsArray.push({'sum': 'Jelenleg nincsenek megjeleníthető adatok!'});
      }
      this.dataSource = new MatTableDataSource(this.resultsArray);
      this.dataSource.paginator = this.paginator;
      console.log(this.resultsArray);
    });
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
