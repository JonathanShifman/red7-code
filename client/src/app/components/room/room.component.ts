import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import * as io from 'socket.io-client';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  socket;
  @Input() storageData;
  roomPlayers = [];
  roomPlayerNames = [];

  @Output() backClick = new EventEmitter();

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.updatePlayerNames();

    this.socket = io('http://localhost:5000');
    this.socket.on('room-players', roomPlayers => this.updateRoomPlayers(roomPlayers));

    console.log(this.storageData.token);
    this.socket.emit('auth', this.storageData.token);
  }

  changeRoomStatus() {
    // const requestUrlTail = this.hasEnteredGame() ? 'leave-lobby' : 'enter-lobby';
    // const body = localStorage.getItem('red7');
    // console.log(body);
    // console.log('Sending change room status request');
    // this.httpClient.post('http://localhost:5000/' + requestUrlTail + '/', JSON.parse(body))
    //   .subscribe(() => {});
    this.httpClient.post('http://localhost:5000/sit-down/', this.storageData)
      .subscribe(() => {});
  }

  updateRoomPlayers(response) {
    console.log('Received room players');
    console.log(response);
    this.roomPlayers = response;
    this.updatePlayerNames();
  }

  updatePlayerNames() {
    this.roomPlayerNames = this.roomPlayers.map(player => player.name);
    while (this.roomPlayerNames.length < 4) {
      this.roomPlayerNames.push('');
    }
  }

  getGameEntranceButtonText() {
    return this.hasEnteredGame() ? 'Leave Game' : 'Enter Game';
  }

  hasEnteredGame() {
    for (let roomPlayer of this.roomPlayers) {
      if (roomPlayer.id === this.storageData.id) {
        return true;
      }
    }
    return false;
  }

  onBackClick() {
    this.backClick.emit();
  }
}
