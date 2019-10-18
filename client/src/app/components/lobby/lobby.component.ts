import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  @Input() gameId;
  @Input() rooms;
  @Output() roomChosen = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  isRoomTaken(index) {
    return this.rooms[index]['taken'] >= this.rooms[index]['capacity'];
  }

  roomClicked(roomId) {
    let roomInfo = {
      gameId: this.gameId,
      roomId: roomId
    };
    this.roomChosen.emit(roomInfo);
  }

}
