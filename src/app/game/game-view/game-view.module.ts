import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';

import { LoadingViewModule } from '../../loading-view/loading-view.module';
import { RouterGuardsModule } from '../../router-guards/router-guards.module';
import { ScoreBoardModule } from '../../score-board/score-board.module';
import { ThreeLineTextModule } from '../../three-line-text/three-line-text.module';
import { TimerModule } from '../../timer/timer.module';
import { WordModule } from '../../word/word.module';

import { PlayerService } from '../../player/player.service';
import { RoomService } from '../../room/room.service';

import { GameViewComponent } from './game-view.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        LoadingViewModule,
        MatButtonModule,
        MatProgressBarModule,
        RouterGuardsModule,
        RouterModule.forChild([]),
        ScoreBoardModule,
        ThreeLineTextModule,
        TimerModule,
        WordModule,
    ],
    declarations: [GameViewComponent],
    exports: [GameViewComponent],
    providers: [
        PlayerService,
        RoomService,
    ],
})
export class GameViewModule {
}
