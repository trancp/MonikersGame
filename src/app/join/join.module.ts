import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { JoinViewModule } from './join-view/join-view.module';
import { CreateViewModule } from '../create/create-view/create-view.module';
import { WordsFormViewModule } from '../words-form-view/words-form-view.module';

import { JoinViewComponent } from './join-view/join-view.component';

@NgModule({
    imports: [
        CommonModule,
        CreateViewModule,
        JoinViewModule,
        WordsFormViewModule,
        RouterModule.forChild([
            {
                path: '',
                component: JoinViewComponent,
            },
        ]),
    ],
})
export class JoinModule {
}
