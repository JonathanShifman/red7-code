import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  @Output() registrationComplete = new EventEmitter();

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  submitRegistration(name: string) {
    if (name.length > 0) {
      this.httpClient.post('http://localhost:5000/register/', {name: name})
        .subscribe(response => this.handleRegistrationResponse(response),
          error => this.handleRegistrationError(error));
    }
  }

  handleRegistrationResponse(response) {
    this.registrationComplete.emit(response);
  }

  handleRegistrationError(error) {
    console.log(error);
  }

}
