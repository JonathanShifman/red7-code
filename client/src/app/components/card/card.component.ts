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
      case 1: return 'red';
      case 2: return 'red';
      case 3: return 'red';
      case 4: return 'red';
      case 5: return 'red';
      case 6: return 'red';
      case 7: return 'red';
    }
  }

}
