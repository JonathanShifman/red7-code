import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-choose-lobby',
  templateUrl: './choose-lobby.component.html',
  styleUrls: ['./choose-lobby.component.css']
})
export class ChooseLobbyComponent implements OnInit {

  @Input() lobbies;
  @Output() lobbySelected = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClick(lobbyId) {
    this.lobbySelected.emit(lobbyId);
  }

}
