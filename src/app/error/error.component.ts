import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'error',
  templateUrl: 'error.component.html',
  styleUrls: ['error.css'],
})
export class ErrorComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

}
