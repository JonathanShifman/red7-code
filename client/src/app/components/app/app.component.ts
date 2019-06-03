import {Component, OnInit} from '@angular/core';
import {Card} from "../../classes/card";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  card = new Card(1, 1);

  handCards: Card[] = [];

  ngOnInit() {
    this.handCards.push(new Card(1, 1));
    this.handCards.push(new Card(2, 2));
    this.handCards.push(new Card(3, 3));
    this.handCards.push(new Card(4, 4));
    this.handCards.push(new Card(5, 5));
    this.handCards.push(new Card(6, 6));
    this.handCards.push(new Card(7, 7));
  }
}
