import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

const ROUND = {
    1: `Say Anything You Want,${'<br>'}but the word.`,
    2: 'One Word.',
    3: 'Charades. No Words.',
};

import get from 'lodash-es/get';

@Component({
    selector: 'app-word',
    templateUrl: './word.component.html',
    styleUrls: ['./word.component.scss'],
})
export class WordComponent implements OnInit {
    @Input() word: string;
    @Input() wordIndex: number;
    @Input() round: number;
    @Output() onSkipWord: EventEmitter<any> = new EventEmitter();
    @Output() onScoreWord: EventEmitter<any> = new EventEmitter();
    roundText: string;

    ngOnInit() {
        this.roundText = get(ROUND, this.round);
    }

    public skip(wordIndex: number): void {
        return this.onSkipWord.emit(wordIndex);
    }

    public score(wordIndex: number): void {
        return this.onScoreWord.emit(wordIndex);
    }
}
