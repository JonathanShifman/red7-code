import {Component, Input, OnInit} from '@angular/core';
import {Card} from "../../classes/card";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() card: Card;

  constructor() { }

  ngOnInit() {
  }

  getColor() : string {
    switch (this.card.color) {
      case 1: return '#ba001f';
      case 2: return '#c96c10';
      case 3: return '#c6c309';
      case 4: return '#24770a';
      case 5: return '#2f93a3';
      case 6: return '#254c91';
      case 7: return '#50208c';
    }
  }

}
