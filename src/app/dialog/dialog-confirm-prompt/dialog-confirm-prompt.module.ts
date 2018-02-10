import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogConfirmPromptComponent } from './dialog-confirm-prompt.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatDialogModule,
    ],
    declarations: [DialogConfirmPromptComponent],
    entryComponents: [DialogConfirmPromptComponent],
})
export class DialogConfirmPromptModule {
}
