import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app/app.component';
import { OpponentComponent } from './components/opponent/opponent.component';
import { CardComponent } from './components/card/card.component';
import { GameComponent } from './components/game/game.component';
import { RoomComponent } from './components/room/room.component';
import {HttpClientModule} from "@angular/common/http";
import { LobbyComponent } from './components/lobby/lobby.component';
import {EntranceComponent} from "./components/entrance/entrance.component";
import {FormsModule} from "@angular/forms";
import { MessageComponent } from './components/message/message.component';
import { HeaderComponent } from './components/header/header.component';
import { ChooseLobbyComponent } from './components/choose-lobby/choose-lobby.component';

@NgModule({
  declarations: [
    AppComponent,
    OpponentComponent,
    CardComponent,
    GameComponent,
    EntranceComponent,
    RoomComponent,
    LobbyComponent,
    MessageComponent,
    HeaderComponent,
    ChooseLobbyComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
