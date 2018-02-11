import { Injectable, Injector } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { FullscreenWindowComponent } from './fullscreen-window.component';
import { FULLSCREEN_WINDOW_DIALOG_DATA } from './fullscreen-window.tokens';
import { OverlayConfig } from './fullscreen-window.interfaces';
import { FullscreenWindowRef } from './fullscreen-window.ref';

@Injectable()
export class FullscreenWindow {

    constructor(private overlay: Overlay,
                private injector: Injector) {
    }

    open(config: OverlayConfig) {
        const overlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'c-fullscreenWindow',
            scrollStrategy: this.overlay.scrollStrategies.block(),
            panelClass: ['c-fullscreenWindow-panel'],
        });
        const fullscreenWindowRef = new FullscreenWindowRef(overlayRef);
        const portal = new ComponentPortal(
            FullscreenWindowComponent,
            null,
            this.createInjector(fullscreenWindowRef, config),
        );
        overlayRef.attach(portal);
        return fullscreenWindowRef;
    }

    createInjector(fullscreenWindowRef: FullscreenWindowRef, config: OverlayConfig): PortalInjector {
        const injectionTokens = new WeakMap();
        injectionTokens.set(FullscreenWindowRef, fullscreenWindowRef);
        injectionTokens.set(FULLSCREEN_WINDOW_DIALOG_DATA, config);
        return new PortalInjector(this.injector, injectionTokens);
    }
}
