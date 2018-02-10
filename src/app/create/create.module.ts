import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CreateViewModule } from './create-view/create-view.module';
import { WordsFormViewModule } from '../words-form-view/words-form-view.module';

import { CreateViewComponent } from './create-view/create-view.component';
import { WordsFormViewComponent } from '../words-form-view/words-form-view.component';

@NgModule({
    imports: [
        CommonModule,
        CreateViewModule,
        WordsFormViewModule,
        RouterModule.forChild([
            {
                path: ':code',
                children: [
                    {
                        path: '',
                        component: CreateViewComponent,
                    },
                    {
                        path: ':name/words',
                        component: WordsFormViewComponent,
                    },
                ],
            },
        ]),
    ],
    declarations: [],
})
export class CreateModule {
}
