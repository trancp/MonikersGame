import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';

import { LoadingViewModule } from '../../loading-view/loading-view.module';
import { PlayersListModule } from '../../players-list/players-list.module';
import { RouterGuardsModule } from '../../router-guards/router-guards.module';
import { SortByTeamsModule } from '../../pipes/sort-by-teams-pipe/sort-by-teams.module';

import { PlayerService } from '../../player/player.service';
import { RoomService } from '../room.service';

import { RoomViewComponent } from './room-view.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        LoadingViewModule,
        MatButtonModule,
        PlayersListModule,
        RouterGuardsModule,
        SortByTeamsModule,
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
