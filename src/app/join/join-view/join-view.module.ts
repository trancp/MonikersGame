import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { LoadingViewModule } from '../../loading-view/loading-view.module';
import { ToastModule } from '../../toast/toast.module';

import { RoomsService } from '../../rooms/rooms.service';

import { JoinViewComponent } from './join-view.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        LoadingViewModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        RouterModule.forChild([]),
        ToastModule,
    ],
    declarations: [JoinViewComponent],
    exports: [JoinViewComponent],
    providers: [
        RoomsService,
    ],
})
export class JoinViewModule {
}
