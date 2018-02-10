import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';

@Injectable()
export class DialogService {
    constructor(private dialog: MatDialog) {
    }

    public openDialogComponent({ component, config = {} }: { component: any, config?: any }): MatDialogRef<any> {
        const matDialogConfig: MatDialogConfig = {
            panelClass: 'mat-dialog-container-padding-0',
            ...config,
        };
        return this.dialog.open(component, matDialogConfig);
    }
}
