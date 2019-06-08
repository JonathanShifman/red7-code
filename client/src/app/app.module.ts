import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app/app.component';
import { OpponentComponent } from './components/opponent/opponent.component';
import { CardComponent } from './components/card/card.component';
import { GameComponent } from './components/game/game.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    OpponentComponent,
    CardComponent,
    GameComponent,
    RegistrationComponent,
    LobbyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
