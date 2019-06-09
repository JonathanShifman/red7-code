import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  startGame() {
    console.log('Entering game');
    const body = localStorage.getItem('red7');
    this.httpClient.post('http://localhost:5000/enter-game/', JSON.parse(body))
      .subscribe(response => console.log(response));
  }

}
