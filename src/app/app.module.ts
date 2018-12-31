import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { ToastModule } from './toast/toast.module';

import { RoomService } from './room/room.service';
import { RoomsService } from './rooms/rooms.service';
import { PlayerService } from './player/player.service';

import { AppComponent } from './app.component';

import { appRoutes } from './app.routes';

const firebaseConfig = {
    apiKey: 'AIzaSyDDYJxYt4TVIJo_TGP_0Ii-WE9yUrhK1c4',
    authDomain: 'monikersgame.firebaseapp.com',
    databaseURL: 'https://monikersgame.firebaseio.com',
    projectId: 'monikersgame',
    storageBucket: '',
    messagingSenderId: '355956033923',
};

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        RouterModule.forRoot(appRoutes),
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
        }),
        ToastModule,
    ],
    providers: [
        RoomService,
        RoomsService,
        PlayerService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
