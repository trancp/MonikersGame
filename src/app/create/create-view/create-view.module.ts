import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { DialogConfirmPromptModule } from '../../dialog/dialog-confirm-prompt/dialog-confirm-prompt.module';
import { DialogModule } from '../../dialog/dialog.module';
import { LoadingViewModule } from '../../loading-view/loading-view.module';

import { PlayerService } from '../../player/player.service';
import { RoomService } from '../../room/room.service';

import { CreateViewComponent } from './create-view.component';

@NgModule({
    imports: [
        CommonModule,
        DialogConfirmPromptModule,
        DialogModule,
        FlexLayoutModule,
        FormsModule,
        LoadingViewModule,
        MatButtonModule,
        RouterModule.forChild([]),
    ],
    declarations: [CreateViewComponent],
    exports: [CreateViewComponent],
    providers: [
        PlayerService,
        RoomService,
    ],
})
export class CreateViewModule {
}
