import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';

import { LoadingViewModule } from '../../loading-view/loading-view.module';
import { ToastModule } from '../../toast/toast.module';

import { RoomService } from '../../room/room.service';
import { RoomsService } from '../../rooms/rooms.service';

import { MainViewComponent } from './main-view.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        LoadingViewModule,
        MatButtonModule,
        RouterModule.forChild([]),
        ToastModule,
    ],
    declarations: [MainViewComponent],
    exports: [MainViewComponent],
    providers: [
        RoomService,
        RoomsService,
    ],
})
export class MainViewModule {
}
