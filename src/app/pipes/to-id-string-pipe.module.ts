import { NgModule } from '@angular/core';

import { ToIdStringPipe } from './to-id-string.pipe';

@NgModule({
    exports: [ToIdStringPipe],
    declarations: [ToIdStringPipe]
})
export class ToIdStringPipeModule {
}
