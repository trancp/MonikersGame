import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { LoadingViewModule } from '../../loading-view/loading-view.module';
import { ScoreBoardModule } from '../../score-board/score-board.module';
import { WinningTeamPipeModule } from '../../pipes/winning-team-pipe/winning-team-pipe.module';
import { RouterGuardsModule} from '../../router-guards/router-guards.module';

import { RoomService } from '../../room/room.service';
import { PlayerService } from '../../player/player.service';

import { GameOverViewComponent } from './game-over-view.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        LoadingViewModule,
        MatButtonModule,
        ScoreBoardModule,
        RouterGuardsModule,
        RouterModule.forChild([]),
        WinningTeamPipeModule,
    ],
    declarations: [GameOverViewComponent],
    exports: [GameOverViewComponent],
    providers: [
        RoomService,
        PlayerService,
    ],
})
export class GameOverViewModule {
}
