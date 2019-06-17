import {Component, OnInit} from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  isRegistered = false;
  gameIsInProgress = false;

  ngOnInit() {
    const storageData = localStorage.getItem('red7');
    this.isRegistered = storageData != null;
    const socket = io('http://localhost:5000');
    socket.emit('auth', storageData)
  }

  onRegistrationComplete(response: any) {
    localStorage.setItem('red7', JSON.stringify(response));
    this.isRegistered = true;
  }
}
