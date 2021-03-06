import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { DialogConfirmPromptModule } from '../../dialog/dialog-confirm-prompt/dialog-confirm-prompt.module';
import { DialogModule } from '../../dialog/dialog.module';
import { LoadingViewModule } from '../../loading-view/loading-view.module';
import { RoomCodeModule } from '../../room-code/room-code.module';

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
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        RoomCodeModule,
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
