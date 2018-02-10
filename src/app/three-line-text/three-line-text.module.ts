import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ThreeLineTextComponent } from './three-line-text.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
    ],
    declarations: [ThreeLineTextComponent],
    exports: [ThreeLineTextComponent],
})
export class ThreeLineTextModule {
}
