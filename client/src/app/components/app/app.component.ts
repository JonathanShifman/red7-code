import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  isRegistered = false;
  gameIsInProgress = false;

  ngOnInit() {
    this.isRegistered = localStorage.getItem('red7') != null;
  }

  onRegistrationComplete(response: any) {
    localStorage.setItem('red7', JSON.stringify(response));
    this.isRegistered = true;
  }
}
