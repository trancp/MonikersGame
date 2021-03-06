import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { GetValuesPipeModule } from '../pipes/get-values-pipe/get-values-pipe.module';
import { LoadingViewModule } from '../loading-view/loading-view.module';
import { RoomCodeModule } from '../room-code/room-code.module';

import { WordsService } from '../words/words.service';
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
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        RoomCodeModule,
    ],
    declarations: [WordsFormViewComponent],
    exports: [WordsFormViewComponent],
    providers: [
        PlayerService,
        RoomService,
        RouteGuardService,
        WordsService,
    ],
})
export class WordsFormViewModule {
}
