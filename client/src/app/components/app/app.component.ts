import { Component } from '@angular/core';
import {Card} from "../../classes/card";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  card = new Card(1, 1);
}
