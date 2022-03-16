import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.css']
})
export class UserComponent implements OnInit {
  isProfileOverlayOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
