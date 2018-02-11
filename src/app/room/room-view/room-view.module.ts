import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { DialogRulesModule } from '../../dialog/dialog-rules/dialog-rules.module';
import { FullscreenWindowModule } from '../../fullscreen-window/fullscreen-window.module';
import { LoadingViewModule } from '../../loading-view/loading-view.module';
import { PlayersListModule } from '../../players-list/players-list.module';
import { RouterGuardsModule } from '../../router-guards/router-guards.module';
import { SortByTeamsModule } from '../../pipes/sort-by-teams-pipe/sort-by-teams.module';
import { WordsStoreModule } from '../../words/words-store.module';

import { PlayerService } from '../../player/player.service';
import { RoomService } from '../room.service';

import { RoomViewComponent } from './room-view.component';

@NgModule({
    imports: [
        CommonModule,
        DialogRulesModule,
        FlexLayoutModule,
        FullscreenWindowModule,
        LoadingViewModule,
        MatButtonModule,
        MatDialogModule,
        PlayersListModule,
        RouterGuardsModule,
        SortByTeamsModule,
        WordsStoreModule,
    ],
    declarations: [RoomViewComponent],
    exports: [RoomViewComponent],
    providers: [
        PlayerService,
        RoomService,
    ],
})
export class RoomViewModule {
}
