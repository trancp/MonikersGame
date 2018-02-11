import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { WordsEffects } from './words.effects.service';

import { wordsReducer } from './words.reducer';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature('words', wordsReducer),
        EffectsModule.forFeature([WordsEffects]),
    ],
    providers: [
        WordsEffects,
    ],
})
export class WordsStoreModule {
}
