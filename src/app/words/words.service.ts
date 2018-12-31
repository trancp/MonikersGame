import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { MONIKERS_WORD_BANK } from './words.helper';

import values from 'lodash-es/values';

@Injectable()
export class WordsService {

    constructor(private db: AngularFireDatabase) {
    }

    private getCustomWords(): FirebaseListObservable<any> {
        return this.db.list('/words');
    }

    getAllWordsFromDb() {
        return this.getCustomWords()
            .pipe(
                map(([words]: [{ [key: string]: string }]) => {
                    return [
                        ...values(words),
                        ...MONIKERS_WORD_BANK,
                        ];
                }),
            );
    }
}
