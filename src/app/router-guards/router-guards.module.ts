import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RouteGuardService } from './router-guards.service';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
    ],
    providers: [RouteGuardService],
})
export class RouterGuardsModule {
}
