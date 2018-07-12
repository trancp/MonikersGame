import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { PlayerService } from '../player/player.service';
import { RoomService } from '../room/room.service';
import { RouteGuardService } from '../router-guards/router-guards.service';

import { GetWords } from '../words/words.actions';

import { AppState } from '../app.state';
import { WordsState } from '../interfaces/words.interfaces';

import compact from 'lodash-es/compact';
import difference from 'lodash-es/difference';
import flatten from 'lodash-es/flatten';
import get from 'lodash-es/get';
import includes from 'lodash-es/includes';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import mapValues from 'lodash-es/mapValues';
import pick from 'lodash-es/pick';
import random from 'lodash-es/random';
import reduce from 'lodash-es/reduce';
import set from 'lodash-es/set';
import values from 'lodash-es/values';

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
const EMPTY_WORDS_ARRAY = new Array(MAX_WORD_SUBMISSIONS);
const WORD_BANKS = ['custom', 'monikers'];

@Component({
    selector: 'app-words-form-view',
    templateUrl: './words-form-view.component.html',
    styleUrls: ['./words-form-view.component.scss'],
})
export class WordsFormViewComponent implements OnInit, OnDestroy {
    EMPTY_WORDS_ARRAY = EMPTY_WORDS_ARRAY;
    inputPlaceholder: string;
    words: string[];
    isJoiningGame: boolean;
    room$: Observable<any>;
    player$: Observable<any>;
    wordsState = this.store.select('words');
    GLOBAL_WORD_BANK: string[] = [];
    wordsFormSubscription: Subscription;
    autoFilledWords: string[] = [];
    wordsFormGroup = reduce(EMPTY_WORDS_ARRAY, (result: any, value: any, index: number) => {
        return set(result, index, new FormControl(''));
    }, {});
    formGroup = new FormGroup(this.wordsFormGroup);
    formFieldAppearances = mapValues({ ...this.wordsFormGroup }, () => 'outline');

    constructor(private formBuilder: FormBuilder,
                private routeGuardService: RouteGuardService,
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
                this.player$.pipe(
                    filter((playerState: any) => !isEmpty(playerState) && !playerState.loading && playerState.name),
                    take(1),
                    map((playerState: any) => this._initializeForm(get(playerState, 'words', []))),
                ).subscribe();
                this.routeGuardService.checkExistingUser();
            });
        this.playerService.dispatchUpdatePlayer({ ready: false });
    }

    ngOnInit() {
        this.store.dispatch(GetWords());
        this.wordsState.pipe(
            filter((wordsState: WordsState) => wordsState.isLoaded),
            take(1),
            map((wordsState: WordsState) => {
                this.GLOBAL_WORD_BANK = flatten(values(pick(wordsState, WORD_BANKS)));
            }),
        ).subscribe();
    }

    ngOnDestroy() {
        this.wordsFormSubscription.unsubscribe();
    }

    private _initializeForm(words: string[]): void {
        this.inputPlaceholder = this.getRandomInputPlaceholder();
        this.initializeWordsForm(words);
        this.wordsFormSubscription = this.formGroup.valueChanges.subscribe((wordsForm: any) => {
            this.inputPlaceholder = this.getRandomInputPlaceholder();
            this.autoFilledWords = this.autoFilledWords.filter((autoFilledWord: string) => includes(values(wordsForm), autoFilledWord));
        });
        this.isJoiningGame = isEqual('join', get(this.route, 'url.value[0].path'));
    }

    private initializeWordsForm(initWordFormValues: string[]) {
        if (isEmpty(initWordFormValues)) {
            return;
        }
        const formControls = reduce(initWordFormValues, (result: any, formValue: string, index: number) => {
            return set(result, index, formValue);
        }, {});
        this.formGroup.patchValue(formControls);
    }

    public goBack(code: string): void {
        const backState = this.isJoiningGame
            ? `/join/${code}`
            : `/create/${code}`;
        this.router.navigate([backState]);
    }

    public onSubmit(word: string, index: number): void {
        const inputWord = word
            || this.inputPlaceholder;
        this._addWordToList(inputWord, index);
    }

    private _addWordToList(inputWord: string, index: number): void {
        if (!inputWord) {
            return;
        }
        this.formGroup.get(`${index}`).patchValue(inputWord);
    }

    public submitWordList(room: any, player: any): void {
        const wordList = values(this.formGroup.value);
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
        return MAX_WORD_SUBMISSIONS === get(compact(values(this.formGroup.value)), 'length');
    }

    getRandomInputPlaceholder(): string {
        if (this.hasEnoughWords()) {
            return '';
        }
        const remainingPlaceholders = difference(INPUT_PLACEHOLDERS, values(this.formGroup.value));
        const placeholderIndex = random(remainingPlaceholders.length - 1);
        return remainingPlaceholders[placeholderIndex];
    }

    public fillInTheBlanks(globalWordBank: string[]) {
        if (this.hasEnoughWords()) {
            return;
        }
        const currentWords = values(this.formGroup.value);
        const emptyWords = currentWords.map((word: string, index: number) => ({ value: word, index })).filter((word: any) => !word.value);
        const newWords = reduce(emptyWords, (result: any, emptyWord: any) => {
            result[emptyWord.index] = this.getUniqueRandomWord(globalWordBank, [...currentWords, ...result]);
            return result;
        }, {});
        this.autoFilledWords = [...this.autoFilledWords, ...values(newWords)];
        this.formGroup.patchValue(newWords);
    }

    private getUniqueRandomWord(globalWordBank: string[], currentWordBank: string[]) {
        const newRandomWord = this.getRandomWordFromGlobalWordBank(globalWordBank);
        return includes(currentWordBank, newRandomWord)
            ? this.getRandomWordFromGlobalWordBank(globalWordBank)
            : newRandomWord;
    }

    private getRandomWordFromGlobalWordBank(globalWordBank: string[]): string {
        const randomWordFromGlobalBankIndex = random(globalWordBank.length - 1);
        return globalWordBank[randomWordFromGlobalBankIndex];
    }

    setFormFieldAppearance(index: number, appearance: string) {
        this.formFieldAppearances[index] = appearance;
    }

    getFormControl(index: number) {
        return this.formGroup.get(`${index}`);
    }
}
