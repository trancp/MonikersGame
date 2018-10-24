import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';

import { NameTagComponent } from './name-tag.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
    ],
    declarations: [NameTagComponent],
    exports: [NameTagComponent],
})
export class NameTagModule {
}
