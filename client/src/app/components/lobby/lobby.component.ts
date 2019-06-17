import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  @Input() socket;
  lobbyPlayers = [];

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get('http://localhost:5000/lobby-players/')
      .subscribe(response => this.updateLobbyPlayers(response));

    this.socket.on('lobby-players', lobbyPlayers => this.updateLobbyPlayers(lobbyPlayers));
  }

  startGame() {
    console.log('Entering game');
    const body = localStorage.getItem('red7');
    this.httpClient.post('http://localhost:5000/enter-game/', JSON.parse(body))
      .subscribe(response => console.log(response));
  }

  updateLobbyPlayers(response) {
    this.lobbyPlayers = response;
    while (this.lobbyPlayers.length < 4) {
      this.lobbyPlayers.push('');
    }
  }

}
