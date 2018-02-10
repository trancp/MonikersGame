import { Component } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgForm } from '@angular/forms';

import { PlayerService } from '../player/player.service';
import { RoomService } from '../room/room.service';
import { RouteGuardService } from '../router-guards/router-guards.service';

import { Observable } from 'rxjs/Observable';

import { AppState } from '../app.state';

import compact from 'lodash-es/compact';
import difference from 'lodash-es/difference';
import fill from 'lodash-es/fill';
import findIndex from 'lodash-es/findIndex';
import get from 'lodash-es/get';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import random from 'lodash-es/random';

const INPUT_PLACEHOLDERS = [
    'A Furry',
    'Male Jiggalo',
    'Velociraptor',
    'Pikachu',
    'Justin Bieber',
    'A Ginger Kid',
    'The Kraken',
    'Bob Ross',
    'Narwhal',
    'Lil Uzi',
    'The Eye of Sauron',
    'Julian Assange',
    'Stephan Hawking',
    'Coitus',
    'A baby fetus',
    'Pepsi Chrystal',
    'Mom jokes',
];
const MAX_WORD_SUBMISSIONS = 5;

@Component({
    selector: 'app-words-form-view',
    templateUrl: './words-form-view.component.html',
    styleUrls: ['./words-form-view.component.scss'],
})
export class WordsFormViewComponent {
    inputPlaceholder: string;
    inputWord: string;
    words: string[];
    wordIndex: number;
    isJoiningGame: boolean;
    room$: Observable<any>;
    player$: Observable<any>;

    constructor(private routeGuardService: RouteGuardService,
                private playerService: PlayerService,
                private roomService: RoomService,
                private route: ActivatedRoute,
                private router: Router,
                private store: Store<AppState>) {
        this.route.paramMap
            .subscribe((params: ParamMap) => {
                const code = params.get('code');
                const name = params.get('name');
                this.roomService.dispatchGetRoom(code);
                this.room$ = this.store.select('room');
                this.playerService.dispatchGetPlayer(name);
                this.player$ = this.store.select('player');
                this.player$.subscribe((player: any) => this._initializeForm(get(player, 'words', [])));
                this.routeGuardService.checkExistingUser();
            });
        this.playerService.dispatchUpdatePlayer({ ready: false });
    }

    private _initializeForm(words: string[]): void {
        this.inputWord = '';
        this.wordIndex = 0;
        this.words = isEmpty(words)
            ? fill(new Array(MAX_WORD_SUBMISSIONS), '')
            : words;
        this.isJoiningGame = isEqual('join', get(this.route, 'url.value[0].path'));
        this.inputPlaceholder = this._getRandomInputPlaceholder();
    }

    public goBack(code: string): void {
        const backState = this.isJoiningGame
            ? `/join/${code}`
            : `/create/${code}`;
        this.router.navigate([backState]);
    }

    public onSubmit(word: string, index: number): void {
        this.inputWord = word
            || this.inputPlaceholder;
        this._addWordToList(this.inputWord, index);
    }

    private _addWordToList(inputWord: string, index: number): void {
        if (!inputWord) {
            return;
        }
        this.words[index] = inputWord;
        this.wordIndex = findIndex(this.words, (word: string) => isEqual('', word));
        this.inputWord = '';
        this.inputPlaceholder = this._getRandomInputPlaceholder();
    }

    public submitWordList(wordList: string[], room: any, player: any): void {
        if (MAX_WORD_SUBMISSIONS !== compact(wordList).length) {
            return;
        }
        this.playerService.dispatchUpdatePlayer({ words: wordList });
        this._goToRoom(room.code, player.name);
    }

    private _goToRoom(code: string, name: string): void {
        this.router.navigate([`/room/${code}/${name}`]);
    }

    public hasEnoughWords(): boolean {
        return MAX_WORD_SUBMISSIONS === get(compact(this.words), 'length');
    }

    public editWord(wordIndex): void {
        this.inputWord = this.words[wordIndex];
        this.words[wordIndex] = '';
        this.wordIndex = wordIndex;
    }

    private _getRandomInputPlaceholder(): string {
        if (this.hasEnoughWords()) {
            return '';
        }
        const remainingPlaceholders = difference(INPUT_PLACEHOLDERS, this.words);
        const placeholderIndex = random(remainingPlaceholders.length - 1);
        return remainingPlaceholders[placeholderIndex];
    }
}
