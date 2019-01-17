import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-word',
    templateUrl: './word.component.html',
    styleUrls: ['./word.component.scss'],
})
export class WordComponent {
    @Input() word: string;
    @Input() wordIndex: number;
    @Output() onSkipWord: EventEmitter<any> = new EventEmitter();
    @Output() onScoreWord: EventEmitter<any> = new EventEmitter();

    public skip(wordIndex: number): void {
        return this.onSkipWord.emit(wordIndex);
    }

    public score(wordIndex: number): void {
        return this.onScoreWord.emit(wordIndex);
    }
}
