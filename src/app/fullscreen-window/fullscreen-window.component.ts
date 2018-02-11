declare let document: any;

import { Component, Inject, Injector, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { filter } from 'rxjs/operators/filter';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';

import { FULLSCREEN_WINDOW_DIALOG_DATA } from './fullscreen-window.tokens';
import { OverlayConfig } from './fullscreen-window.interfaces';
import { FullscreenWindowRef } from './fullscreen-window.ref';

const ESC_KEY_CODE = 27;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-fullscreen-window',
    styleUrls: ['./fullscreen-window.component.scss'],
    templateUrl: './fullscreen-window.component.html',
})
export class FullscreenWindowComponent implements OnInit, OnDestroy {
    childPortal: ComponentPortal<any>;
    escapeKeyUpEvents = fromEvent(document, 'keyup').pipe(
        filter((value: { keyCode: number }) => ESC_KEY_CODE === value.keyCode),
    );
    componentDestroy = new Subject();

    constructor(@Inject(FULLSCREEN_WINDOW_DIALOG_DATA) public config: OverlayConfig,
                private fullscreenWindowRef: FullscreenWindowRef,
                private injector: Injector) {
    }

    ngOnInit() {
        this.childPortal = new ComponentPortal(
            this.config.component,
            null,
            this.createChildInjector(this.fullscreenWindowRef, this.config.data),
        );

        this.escapeKeyUpEvents.pipe(
            takeUntil(this.componentDestroy),
        ).subscribe(() => this.close());
    }

    ngOnDestroy() {
        this.componentDestroy.next();
        this.componentDestroy.complete();
    }

    createChildInjector(fullscreenWindowRef: FullscreenWindowRef, data: any): PortalInjector {
        const injectionTokens = new WeakMap();
        injectionTokens.set(FullscreenWindowRef, fullscreenWindowRef);
        injectionTokens.set(FULLSCREEN_WINDOW_DIALOG_DATA, data);
        return new PortalInjector(this.injector, injectionTokens);
    }

    close() {
        this.fullscreenWindowRef.close();
    }
}
