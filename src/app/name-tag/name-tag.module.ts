import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NameTagComponent } from './name-tag.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
    ],
    declarations: [NameTagComponent],
    exports: [NameTagComponent],
})
export class NameTagModule {
}
