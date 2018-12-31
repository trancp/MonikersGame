import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CreateViewModule } from './create-view/create-view.module';
import { WordsFormViewModule } from '../words-form-view/words-form-view.module';
import { GameOverViewModule } from '../game/game-over-view/game-over-view.module';
import { GameViewModule } from '../game/game-view/game-view.module';
import { RoomViewModule } from '../room/room-view/room-view.module';
import { WaitingViewModule } from '../waiting-view/waiting-view.module';

import { InGameUserGuardService } from '../guards/in-game-user-guard.service';

import { CreateViewComponent } from './create-view/create-view.component';
import { WordsFormViewComponent } from '../words-form-view/words-form-view.component';
import { GameViewComponent } from '../game/game-view/game-view.component';
import { GameOverViewComponent } from '../game/game-over-view/game-over-view.component';
import { RoomViewComponent } from '../room/room-view/room-view.component';
import { WaitingViewComponent } from '../waiting-view/waiting-view.component';

@NgModule({
    imports: [
        CommonModule,
        CreateViewModule,
        GameOverViewModule,
        GameViewModule,
        RoomViewModule,
        WaitingViewModule,
        WordsFormViewModule,
        RouterModule.forChild([
            {
                path: '',
                children: [
                    {
                        path: '',
                        component: CreateViewComponent,
                    },
                    {
                        path: ':slug',
                        children: [
                            {
                                path: '',
                                redirectTo: 'words',
                            },
                            {
                                path: 'words',
                                component: WordsFormViewComponent,
                                canActivate: [InGameUserGuardService],
                            },
                            {
                                path: 'room',
                                component: RoomViewComponent,
                            },
                            {
                                path: 'game',
                                component: GameViewComponent,
                            },
                            {
                                path: 'waiting',
                                component: WaitingViewComponent,
                            },
                            {
                                path: 'over',
                                component: GameOverViewComponent,
                            },
                        ],
                    },
                ],
            },
        ]),
    ],
    providers: [InGameUserGuardService],
})
export class CreateModule {
}
