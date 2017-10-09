import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Room } from './interfaces/room.model';
import * as roomActions from './room/room.actions';

interface AppState {
    room: Room;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    room$: Observable<Room>;

    constructor(public angularFireDatabase: AngularFireDatabase, private store: Store<AppState>) {
        this.room$ = this.store.select('room');
    }
}
