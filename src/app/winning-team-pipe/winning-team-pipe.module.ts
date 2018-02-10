import { NgModule } from '@angular/core';

import { WinningTeamPipe } from './winning-team.pipe';

@NgModule({
    exports: [WinningTeamPipe],
    declarations: [WinningTeamPipe],
})
export class WinningTeamPipeModule {
}
