import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-confirm-prompt',
    templateUrl: './dialog-confirm-prompt.component.html',
    styleUrls: ['./dialog-confirm-prompt.component.scss']
})
export class DialogConfirmPromptComponent {

    constructor(public dialogRef: MatDialogRef<DialogConfirmPromptComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    confirm(data: any): void {
        this.dialogRef.close(data);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
