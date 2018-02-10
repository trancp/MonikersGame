import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NameDropZoneComponent } from './name-drop-zone.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
    ],
    declarations: [NameDropZoneComponent],
    exports: [NameDropZoneComponent],
})
export class NameDropZoneModule {
}
