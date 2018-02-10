import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { LoadingViewModule } from '../loading-view/loading-view.module';
import { RouterGuardsModule } from '../router-guards/router-guards.module';

import { RoomService } from '../room/room.service';
import { PlayerService } from '../player/player.service';

import { WaitingViewComponent } from './waiting-view.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        LoadingViewModule,
        RouterGuardsModule,
        RouterModule.forChild([
            {
                path: '',
                children: [
                    {
                        path: ':code',
                        children: [
                            {
                                path: ':name',
                                component: WaitingViewComponent,
                            },
                        ],
                    },
                ],
            },
        ]),
    ],
    declarations: [WaitingViewComponent],
    exports: [WaitingViewComponent],
    providers: [
        RoomService,
        PlayerService,
    ],
})
export class WaitingViewModule {
}
