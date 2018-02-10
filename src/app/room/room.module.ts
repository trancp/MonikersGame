import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RoomViewModule } from './room-view/room-view.module';

import { RoomViewComponent } from './room-view/room-view.component';

@NgModule({
    imports: [
        CommonModule,
        RoomViewModule,
        RouterModule.forChild([
            {
                path: '',
                children: [
                    {
                        path: ':code',
                        children: [
                            {
                                path: ':name',
                                component: RoomViewComponent,
                            },
                        ],
                    },
                ],
            },
        ]),
    ],
    declarations: [],
})
export class RoomModule {
}
