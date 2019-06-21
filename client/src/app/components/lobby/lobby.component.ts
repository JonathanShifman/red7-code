import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as io from 'socket.io-client';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  socket;
  @Input() storageData;
  lobbyPlayers = [];

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get('http://localhost:5000/lobby-players/')
      .subscribe(response => this.updateLobbyPlayers(response));

    this.socket = io('http://localhost:5000');
    this.socket.on('lobby-players', lobbyPlayers => this.updateLobbyPlayers(lobbyPlayers));
  }

  changeLobbyStatus() {
    const requestUrlTail = this.hasEnteredGame() ? 'leave-game' : 'enter-game';
    const body = localStorage.getItem('red7');
    console.log('Sending change lobby status request');
    this.httpClient.post('http://localhost:5000/' + requestUrlTail + '/', JSON.parse(body))
      .subscribe(response => console.log(response));
  }

  updateLobbyPlayers(response) {
    console.log('a');
    this.lobbyPlayers = response;
    while (this.lobbyPlayers.length < 4) {
      this.lobbyPlayers.push('');
    }
  }

  getGameEntranceButtonText() {
    return this.hasEnteredGame() ? 'Leave Game' : 'Enter Game';
  }

  hasEnteredGame() {
    for (let lobbyPlayer of this.lobbyPlayers) {
      if (lobbyPlayer.id === this.storageData.id) {
        return true;
      }
      return false;
    }
  }

}
