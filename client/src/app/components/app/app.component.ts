import {Component, OnInit} from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  socket;
  isRegistered = false;
  gameIsInProgress = false;

  ngOnInit() {
    const storageData = localStorage.getItem('red7');
    this.isRegistered = storageData != null;
    this.socket = io('http://localhost:5000');
    this.socket.emit('auth', storageData);
  }

  onRegistrationComplete(response: any) {
    localStorage.setItem('red7', JSON.stringify(response));
    this.isRegistered = true;
  }
}
