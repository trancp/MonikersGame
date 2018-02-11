import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FullscreenOverlayContainer, OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';

import { FullscreenWindow } from './fullscreen-window.service';

import { FullscreenWindowComponent } from './fullscreen-window.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        OverlayModule,
        PortalModule,
    ],
    declarations: [
        FullscreenWindowComponent,
    ],
    providers: [
        {
            provide: OverlayContainer,
            useClass: FullscreenOverlayContainer,
        },
        FullscreenWindow,
    ],
    entryComponents: [
        FullscreenWindowComponent,
    ],
})
export class FullscreenWindowModule {
}
