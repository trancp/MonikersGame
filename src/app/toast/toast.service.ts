import {Injectable} from '@angular/core';
import {
    MatSnackBar,
    MatSnackBarRef,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';

import {ToastComponent} from './toast.component';

interface Itoast {
    message?: string;
    action?: string;
    duration?: number;
    horizontalPosition?: MatSnackBarHorizontalPosition;
    verticalPosition?: MatSnackBarVerticalPosition;
    data?: any;
}

@Injectable()
export class ToastService {
    constructor(private toast: MatSnackBar) {
    }

    showSuccess(message: string): MatSnackBarRef<any> {
        return this.showToast({
            data: {
                message,
                type: 'success'
            }
        });
    }

    showError(message: string): MatSnackBarRef<any> {
        return this.showToast({
            data: {
                message,
                type: 'error'
            }
        });
    }

    private showToast({message, action = '', duration = 5000, horizontalPosition = 'left', verticalPosition = 'bottom', data}: Itoast): MatSnackBarRef<any> {
        const toastConfig = {
            data,
            duration,
            horizontalPosition,
            verticalPosition
        };
        if (message) {
            return this.toast.open(message, action, toastConfig);
        }
        return this.toast.openFromComponent(ToastComponent, toastConfig);
    }
}
