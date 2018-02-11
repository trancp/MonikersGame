import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { GetValuesPipeModule } from '../pipes/get-values-pipe/get-values-pipe.module';
import { LoadingViewModule } from '../loading-view/loading-view.module';
import { WordsStoreModule } from '../words/words-store.module';

import { PlayerService } from '../player/player.service';
import { RoomService } from '../room/room.service';
import { RouteGuardService } from '../router-guards/router-guards.service';

import { WordsFormViewComponent } from './words-form-view.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        GetValuesPipeModule,
        LoadingViewModule,
        MatButtonModule,
        ReactiveFormsModule,
        WordsStoreModule,
    ],
    declarations: [WordsFormViewComponent],
    exports: [WordsFormViewComponent],
    providers: [
        PlayerService,
        RoomService,
        RouteGuardService,
    ],
})
export class WordsFormViewModule {
}
