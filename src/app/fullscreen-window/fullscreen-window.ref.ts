import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs/Subject';

export class FullscreenWindowRef {
    afterClosed = new Subject();

    constructor(private overlayRef: OverlayRef) {
    }

    close(data?: any): void {
        this.overlayRef.dispose();
        this.afterClosed.next(data);
        this.afterClosed.complete();
    }
}
