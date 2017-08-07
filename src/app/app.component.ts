import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';
    items: FirebaseListObservable<any[]>;
    msgVal: string;

    constructor(public angularFireDatabase: AngularFireDatabase) {
        this.items = angularFireDatabase.list('/messages', {
            query: {
                limitToLast: 50
            }
        });
    }

    Send(desc: string) {
        this.items.push({ message: desc });
        this.msgVal = '';
    }
}
