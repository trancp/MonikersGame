import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RouterGuardsModule } from '../router-guards/router-guards.module';

import { RoomService } from '../room/room.service';
import { PlayerService } from '../player/player.service';

import { TimerComponent } from './timer.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatProgressSpinnerModule,
        RouterGuardsModule,
    ],
    declarations: [TimerComponent],
    exports: [TimerComponent],
    providers: [
        PlayerService,
        RoomService,
    ],
})
export class TimerModule {
}
