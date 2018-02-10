import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NameDropZoneModule } from '../name-drop-zone/name-drop-zone.module';
import { NameTagModule } from '../name-tag/name-tag.module';

import { PlayersListComponent } from './players-list.component';

@NgModule({
    imports: [
        CommonModule,
        NameDropZoneModule,
        NameTagModule,
    ],
    declarations: [PlayersListComponent],
    exports: [PlayersListComponent],
})
export class PlayersListModule {
}
