import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import capitalize from 'lodash-es/capitalize';

const WORDS_TO_ADD_TO_DEFAULT_MONIKERS_WORD_BANK = [];

@Injectable()
export class RoomsService {

    constructor(private db: AngularFireDatabase) {
    }

    getAllRooms() {
        return this.db.list('/rooms');
    }

    submitMonikerWords() {
        WORDS_TO_ADD_TO_DEFAULT_MONIKERS_WORD_BANK.map((word: string) => {
            const wordToPush = word.split(' ').map((o: string) => capitalize(o)).join(' ');
            this.db.list('/words/monikers').push(wordToPush);
        });
    }
}
