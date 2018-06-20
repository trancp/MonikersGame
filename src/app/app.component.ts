import { Component } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Room } from './interfaces/room.model';

interface AppState {
    room: Room;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    room$: Observable<Room>;

    constructor(public angularFireDatabase: AngularFireDatabase, private store: Store<AppState>) {
        this.room$ = this.store.select('room');
    }
}
