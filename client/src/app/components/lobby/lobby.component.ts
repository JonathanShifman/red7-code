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
  lobbyPlayerNames = [];

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.updatePlayerNames()

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
      .subscribe(() => {});
  }

  updateLobbyPlayers(response) {
    this.lobbyPlayers = response;
    this.updatePlayerNames()
  }

  updatePlayerNames() {
    this.lobbyPlayerNames = this.lobbyPlayers.map(player => player.name);
    while (this.lobbyPlayerNames.length < 4) {
      this.lobbyPlayerNames.push('');
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
    }
    return false;
  }

}
