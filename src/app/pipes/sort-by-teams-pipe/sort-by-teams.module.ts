import { NgModule } from '@angular/core';

import { SortByTeamsPipe } from './sort-by-teams.pipe';

@NgModule({
    exports: [SortByTeamsPipe],
    declarations: [SortByTeamsPipe],
})
export class SortByTeamsModule {
}
