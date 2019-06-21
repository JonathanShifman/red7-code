import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  storageData;
  isRegistered = false;
  gameIsInProgress = false;

  ngOnInit() {
    const storageDataString = localStorage.getItem('red7');
    this.storageData = JSON.parse(storageDataString);
    this.isRegistered = storageDataString != null;
  }

  onRegistrationComplete(response: any) {
    localStorage.setItem('red7', JSON.stringify(response));
    this.isRegistered = true;
  }
}
