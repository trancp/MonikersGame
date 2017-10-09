import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ToastService } from './toast.service';

import { ToastComponent } from './toast.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatSnackBarModule
    ],
    declarations: [ToastComponent],
    providers: [ToastService],
    entryComponents: [ToastComponent]
})
export class ToastModule {
}
