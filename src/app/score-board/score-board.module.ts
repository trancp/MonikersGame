import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ScoreBoardComponent } from './score-board.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
    ],
    declarations: [ScoreBoardComponent],
    exports: [ScoreBoardComponent],
})
export class ScoreBoardModule {
}
