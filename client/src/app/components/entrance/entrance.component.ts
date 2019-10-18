import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {getLocalStorage, setLocalStorage} from '../../modules/utils';

@Component({
  selector: 'app-entrance',
  templateUrl: './entrance.component.html',
  styleUrls: ['./entrance.component.css']
})
export class EntranceComponent implements OnInit {

  @Output() successfulEntrance = new EventEmitter();

  selectedMenuItem = 0;
  loginName;
  loginPassword;
  registrationName;
  registrationPassword;

  messageWidth = 400;
  loginMessage;
  registerMessage;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  submitLogin() {
    this.loginMessage = null;
    if (this.loginName == null || this.loginName.length === 0 || this.loginPassword == null || this.loginPassword.length === 0) {
      this.loginMessage = 'Name and password cannot be empty';
      return;
    }
    this.httpClient.post('http://localhost:5000/login/', {name: this.loginName, password: this.loginPassword})
      .subscribe(response => this.handleLoginResponse(response),
        error => this.handleLoginError(error));
  }

  handleLoginResponse(response) {
    if (response.success) {
      setLocalStorage({token: response.token});
      this.successfulEntrance.emit();
    } else {
      this.loginMessage = response.message;
    }
  }

  handleLoginError(error) {
    console.log(error);
  }

  submitRegistration() {
    this.registerMessage = null;
    if (this.registrationName == null || this.registrationName.length === 0 || this.registrationPassword == null || this.registrationPassword.length === 0) {
      this.registerMessage = 'Name and password cannot be empty';
      return;
    }
    console.log('Submitting registration');
    this.httpClient.post('http://localhost:5000/register/', {name: this.registrationName, password: this.registrationPassword})
      .subscribe(response => this.handleRegistrationResponse(response),
        error => this.handleRegistrationError(error));
  }

  handleRegistrationResponse(response) {
    console.log('Received registration response');
    console.log(response);
    if (response.success) {
      setLocalStorage({token: response.token});
      this.successfulEntrance.emit();
    } else {
      this.registerMessage = response.message;
    }
  }

  handleRegistrationError(error) {
    console.log(error);
  }

  selectMenuItem(item) {
    this.selectedMenuItem = item;
  }

  clearLoginMessage() {
    this.loginMessage = null;
  }

  clearRegisterMessage() {
    this.registerMessage = null;
  }
}
