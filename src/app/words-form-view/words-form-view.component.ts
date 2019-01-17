declare let window: any;

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, takeUntil, tap} from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Location } from '@angular/common';

import { PlayerService } from '../player/player.service';
import { RoomService } from '../room/room.service';
import { RouteGuardService } from '../router-guards/router-guards.service';
import { WordsService } from '../words/words.service';

import { Room } from '../interfaces/room.model';
import { Player } from '../interfaces/player.model';

import capitalize from 'lodash-es/capitalize';
import compact from 'lodash-es/compact';
import difference from 'lodash-es/difference';
import findKey from 'lodash-es/findKey';
import get from 'lodash-es/get';
import includes from 'lodash-es/includes';
import isEmpty from 'lodash-es/isEmpty';
import isUndefined from 'lodash-es/isUndefined';
import random from 'lodash-es/random';
import reduce from 'lodash-es/reduce';
import set from 'lodash-es/set';
import trim from 'lodash-es/trim';
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
    GLOBAL_WORD_BANK: string[] = [];
    autoFilledWords: string[] = [];
    wordsFormGroup = reduce(EMPTY_WORDS_ARRAY, (result: any, value: any, index: number) => {
        return set(result, index, new FormControl(''));
    }, {});
    formGroup = new FormGroup(this.wordsFormGroup);
    inputForm = new FormControl('');
    editIndex = 0;
    roomState: BehaviorSubject<Room> = new BehaviorSubject({ loading: true });
    playerState: BehaviorSubject<Player> = new BehaviorSubject({ loading: true });
    componentDestroy = new Subject();

    constructor(private formBuilder: FormBuilder,
                private location: Location,
                private routeGuardService: RouteGuardService,
                private playerService: PlayerService,
                private roomService: RoomService,
                private route: ActivatedRoute,
                private router: Router,
                private wordsService: WordsService) {
    }

    ngOnInit() {
        const slug = this.route.snapshot.paramMap.get('slug');
        const roomCode = this.route.snapshot.paramMap.get('code');
        this.roomService.getRoomByCode(roomCode)
            .pipe(
                takeUntil(this.componentDestroy),
                tap((room: Room) => {
                    this.roomState.next(room);
                    this.playerService.getPlayerByName(room, slug)
                        .pipe(
                            takeUntil(this.componentDestroy),
                            tap((player: Player) => {
                                this._initializeForm(get(player, 'words', []));
                                this.editIndex = this.getNextEmptyWordForm();
                                this.toggleInputForm(this.editIndex);
                                this.playerState.next(player);
                            }),
                        )
                        .subscribe();
                }),
            )
            .subscribe();
        this.wordsService.getAllWordsFromDb()
            .pipe(
                takeUntil(this.componentDestroy),
                map((words: string[]) => {
                    this.GLOBAL_WORD_BANK = words;
                }),
            ).subscribe();
    }

    ngOnDestroy() {
        this.componentDestroy.next();
        this.componentDestroy.complete();
    }

    private _initializeForm(words: string[]): void {
        this.initializeWordsForm(words);
        this.inputPlaceholder = this.getRandomInputPlaceholder();
        this.formGroup.valueChanges
            .pipe(
                takeUntil(this.componentDestroy),
                tap((wordsForm: any) => {
                    this.inputPlaceholder = this.getRandomInputPlaceholder();
                    this.autoFilledWords = this.autoFilledWords.filter((autoFilledWord: string) => includes(values(wordsForm), autoFilledWord));
                }),
            )
            .subscribe();
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

    public goBack() {
        return 1 === window.history.length
            ? this.router.navigate(['/'])
            : this.location.back();
    }

    public submitPhrase(phrase: string, index: number): void {
        const inputPhrase = phrase
            || this.inputPlaceholder;
        const sanitizedPhrase = this.sanitizePhrase(inputPhrase);
        this.formGroup.get(`${index}`).patchValue(sanitizedPhrase);
        this.editIndex = this.getNextEmptyWordForm();
        this.toggleInputForm(this.editIndex);
        this.inputForm.patchValue('');
    }

    sanitizePhrase(phrase: string) {
        return trim(phrase).split(' ').map((word: string) => capitalize(word)).join(' ');
    }

    public submitWordList(player: any): void {
        if (!this.hasEnoughWords()) {
            return;
        }
        const room = this.roomState.getValue();
        this.playerService.updatePlayerProperties(player, { words: values(this.formGroup.value) });
        this.router.navigate([`/${room.code}/${player.slug}/room`]);
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
        this.toggleInputForm(this.editIndex);
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
            return;
        }
        return parseInt(index, 10);
    }

    toggleInputForm(nextEmptyWordIndex: any) {
        if (isUndefined(nextEmptyWordIndex)) {
            return this.inputForm.disable();
        }
        return this.inputForm.enable();
    }

    removeWord(editIndex: number) {
        this.formGroup.get(`${editIndex}`).patchValue('');
    }

    goToHome() {
        return this.router.navigate(['/']);
    }
}
