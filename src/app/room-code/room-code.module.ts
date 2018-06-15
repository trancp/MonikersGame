import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RoomCodeComponent } from './room-code.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
    ],
    declarations: [
        RoomCodeComponent,
    ],
    exports: [
        RoomCodeComponent,
    ],
})
export class RoomCodeModule {
}
