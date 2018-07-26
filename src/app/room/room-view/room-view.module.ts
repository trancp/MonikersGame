import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { DialogRulesModule } from '../../dialog/dialog-rules/dialog-rules.module';
import { LoadingViewModule } from '../../loading-view/loading-view.module';
import { PlayersListModule } from '../../players-list/players-list.module';
import { RoomCodeModule } from '../../room-code/room-code.module';
import { RouterGuardsModule } from '../../router-guards/router-guards.module';
import { SortByTeamsModule } from '../../pipes/sort-by-teams-pipe/sort-by-teams.module';

import { PlayerService } from '../../player/player.service';
import { RoomService } from '../room.service';
import { WordsService } from '../../words/words.service';

import { RoomViewComponent } from './room-view.component';

@NgModule({
    imports: [
        CommonModule,
        DialogRulesModule,
        FlexLayoutModule,
        LoadingViewModule,
        MatButtonModule,
        MatDialogModule,
        PlayersListModule,
        RoomCodeModule,
        RouterGuardsModule,
        SortByTeamsModule,
    ],
    declarations: [RoomViewComponent],
    exports: [RoomViewComponent],
    providers: [
        PlayerService,
        RoomService,
        WordsService,
    ],
})
export class RoomViewModule {
}
