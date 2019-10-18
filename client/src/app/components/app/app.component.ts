import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  storageData;
  status = -1;
  lobbies;
  lobbiesList = [];
  room;
  rooms;
  chosenLobby = -1;

  constructor(private httpClient: HttpClient) {
    this.readStorageData();
    this.requestStatus();
  }

  ngOnInit() {
  }

  requestStatus() {
    this.httpClient.post('http://localhost:5000/status/', this.storageData)
      .subscribe(response => this.receiveStatus(response));
  }

  receiveStatus(response) {
    this.status = response['status'];
    if (this.status == 1) {
      this.lobbies = response['games'];
      this.lobbiesList = [];
      for (let gameId in this.lobbies) {
        this.lobbiesList.push(this.lobbies[gameId]);
      }
    }
  }

  onRegistrationComplete() {
    this.readStorageData();
    this.requestStatus();
  }

  readStorageData() {
    const storageDataString = localStorage.getItem('red7');
    this.storageData = JSON.parse(storageDataString);
  }

  roomChosen(index) {
    this.room = index;
  }

  onBackClick() {
    this.room = null;
  }

  signOutClicked() {
    localStorage.removeItem("red7");
    this.storageData = null;
    this.status = 0;
  }

  onLobbySelected(lobbyId) {
    this.chosenLobby = lobbyId;
    this.rooms = this.lobbies[lobbyId].rooms;
  }
}
