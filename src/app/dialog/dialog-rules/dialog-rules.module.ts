import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { LoadingViewModule } from '../../loading-view/loading-view.module';

import { DialogRulesComponent } from './dialog-rules.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        LoadingViewModule,
        MatButtonModule,
        MatDialogModule,
    ],
    declarations: [DialogRulesComponent],
    exports: [DialogRulesComponent],
    entryComponents: [DialogRulesComponent],
})
export class DialogRulesModule {
}
