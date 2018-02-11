import { NgModule } from '@angular/core';

import { GetValuesPipe } from './get-values.pipe';

@NgModule({
    exports: [GetValuesPipe],
    declarations: [GetValuesPipe],
})
export class GetValuesPipeModule {
}
