import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GameOverViewModule } from './game-over-view/game-over-view.module';
import { GameViewModule } from './game-view/game-view.module';

import { GameOverViewComponent } from './game-over-view/game-over-view.component';
import { GameViewComponent } from './game-view/game-view.component';

@NgModule({
    imports: [
        CommonModule,
        GameOverViewModule,
        GameViewModule,
        RouterModule.forChild([
            {
                path: ':code',
                children: [
                    {
                        path: ':slug',
                        children: [
                            {
                                path: '',
                                component: GameViewComponent,
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
    declarations: [],
})
export class GameModule {
}
