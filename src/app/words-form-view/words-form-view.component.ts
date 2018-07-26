import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { PlayerService } from '../player/player.service';
import { RoomService } from '../room/room.service';
import { RouteGuardService } from '../router-guards/router-guards.service';
import { WordsService } from '../words/words.service';

import { AppState } from '../app.state';

import compact from 'lodash-es/compact';
import difference from 'lodash-es/difference';
import findKey from 'lodash-es/findKey';
import get from 'lodash-es/get';
import includes from 'lodash-es/includes';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import isUndefined from 'lodash-es/isUndefined';
import random from 'lodash-es/random';
import reduce from 'lodash-es/reduce';
import set from 'lodash-es/set';
import values from 'lodash-es/values';
import { Room } from '../interfaces/room.model';
import { Player } from '../interfaces/player.model';

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

@Component({
    selector: 'app-words-form-view',
    templateUrl: './words-form-view.component.html',
    styleUrls: ['./words-form-view.component.scss'],
})
export class WordsFormViewComponent implements OnInit, OnDestroy {
    @ViewChild('input') private inputElement: ElementRef;
    EMPTY_WORDS_ARRAY = EMPTY_WORDS_ARRAY;
    inputPlaceholder: string;
    words: string[];
    isJoiningGame: boolean;
    GLOBAL_WORD_BANK: string[] = [];
    wordsFormSubscription: Subscription;
    autoFilledWords: string[] = [];
    wordsFormGroup = reduce(EMPTY_WORDS_ARRAY, (result: any, value: any, index: number) => {
        return set(result, index, new FormControl(''));
    }, {});
    formGroup = new FormGroup(this.wordsFormGroup);
    inputForm = new FormControl('');
    editIndex = 0;
    roomState: Observable<Room>;
    playerState: Observable<Room>;
    isLoading = false;
    playerIsLoading = false;

    constructor(private formBuilder: FormBuilder,
                private routeGuardService: RouteGuardService,
                private playerService: PlayerService,
                private roomService: RoomService,
                private route: ActivatedRoute,
                private router: Router,
                private store: Store<AppState>,
                private wordsService: WordsService) {
        this.route.paramMap
            .subscribe(() => {
                this.routeGuardService.checkExistingUser();
            });
    }

    ngOnInit() {
        this.isLoading = true;
        const name = this.route.snapshot.paramMap.get('name');
        const roomCode = this.route.snapshot.paramMap.get('code');
        this.roomState = this.roomService.getRoomByCode(roomCode)
            .pipe(
                tap((room: Room) => {
                    this.getPlayerByNameForRoom(room, name);
                    this.isLoading = false;
                }),
            );
        this.wordsService.getAllWordsFromDb()
            .pipe(
                map((words: string[]) => {
                    this.GLOBAL_WORD_BANK = words;
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
        this.editIndex = this.getNextEmptyWordForm();
        this.enableInformFormIfFormHasEmptyValues();
        this.inputForm.patchValue('');
    }

    private _addWordToList(inputWord: string, index: number): void {
        if (!inputWord) {
            return;
        }
        this.formGroup.get(`${index}`).patchValue(inputWord);
    }

    public submitWordList(room: any, player: any): void {
        if (isUndefined(this.editIndex)) {
            return;
        }
        this.playerService.updatePlayerProperties(player, { words: values(this.formGroup.value) });
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
        const emptyWords = currentWords.map((word: string, index: number) => ({
            value: word,
            index,
        })).filter((word: any) => !word.value);
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

    getFormControl(index: number) {
        return this.formGroup.get(`${index}`);
    }

    setFormToEdit(wordIndex: number) {
        this.editIndex = wordIndex;
        this.inputForm.patchValue(this.formGroup.get(`${wordIndex}`).value);
        this.enableInformFormIfFormHasEmptyValues();
        this.inputElement.nativeElement.focus();
    }

    submitCurrentWord() {
        if (isUndefined(this.editIndex)) {
            return;
        }
        const wordForm = this.formGroup.get(`${this.editIndex}`);
        const currentWord = get(wordForm, 'value');
        if (currentWord || !this.inputForm.value) {
            return;
        }
        wordForm.patchValue(this.inputForm.value);
    }

    getNextEmptyWordForm() {
        const index = findKey(this.formGroup.value, (word: string) => !word);
        if (isUndefined(index)) {
            return index;
        }
        return parseInt(index, 10);
    }

    enableInformFormIfFormHasEmptyValues() {
        if (isUndefined(this.editIndex)) {
            return this.inputForm.disable();
        }
        return this.inputForm.enable();
    }

    getPlayerByNameForRoom(room: Room, name: string) {
        this.playerIsLoading = true;
        this.playerState = this.playerService.getPlayerByName(room, name)
            .pipe(
                tap((player: Player) => {
                    this._initializeForm(get(player, 'words', []));
                    this.playerIsLoading = false;
                    this.playerService.updatePlayerProperties(player, { ready: false });
                }),
            );
    }
}
