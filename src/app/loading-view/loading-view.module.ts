import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LoadingViewComponent } from './loading-view.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatProgressSpinnerModule,
    ],
    declarations: [LoadingViewComponent],
    exports: [LoadingViewComponent],
})
export class LoadingViewModule {
}
