import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AppComponent } from './app.component';

export const firebaseConfig = {
    apiKey: 'AIzaSyDDYJxYt4TVIJo_TGP_0Ii-WE9yUrhK1c4',
    authDomain: 'monikersgame.firebaseapp.com',
    databaseURL: 'https://monikersgame.firebaseio.com',
    projectId: 'monikersgame',
    storageBucket: '',
    messagingSenderId: '355956033923'
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
