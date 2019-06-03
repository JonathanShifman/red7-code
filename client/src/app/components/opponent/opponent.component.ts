import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-opponent',
  templateUrl: './opponent.component.html',
  styleUrls: ['./opponent.component.css']
})
export class OpponentComponent implements OnInit {

  @Input() name: string;
  @Input() numOfCards: number;

  constructor() { }

  ngOnInit() {
  }

}
