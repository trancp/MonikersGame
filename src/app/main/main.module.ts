import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MainViewModule } from './main-view/main-view.module';
import { MainViewComponent } from './main-view/main-view.component';

@NgModule({
    imports: [
        CommonModule,
        MainViewModule,
        RouterModule.forChild([
            {
                path: '',
                component: MainViewComponent,
            },
        ]),
    ],
    declarations: [],
})
export class MainModule {
}
