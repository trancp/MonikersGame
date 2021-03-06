import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DataTransfer } from '../interfaces/data-transfer.model';
import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';
import { Player } from '../interfaces/player.model';

interface Iplayer {
    id?: string;
    name: string;
    ready: boolean;
    team: number;
    vip: boolean;
}

interface ImovingPlayer {
    player: Iplayer;
    listIndex: number;
    newTeam?: number;
}

@Component({
    selector: 'app-players-list',
    templateUrl: './players-list.component.html',
    styleUrls: ['./players-list.component.scss'],
})
export class PlayersListComponent {
    @Input() players: Iplayer[];
    @Input() alignment: string;
    @Input() teamName: string;
    @Input() teamId: string;
    @Input() user: Player;
    @Output() onDragStart = new EventEmitter();
    @Output() switchPlayerToNewTeam = new EventEmitter();
    @Output() remove = new EventEmitter();
    @Input() dataToTransfer: DataTransfer;

    switchTeamsHandler(event, listIndex) {
        const playerStringify = event.dataTransfer.getData('player');
        const player: Iplayer = JSON.parse(playerStringify);
        const playerToMove: ImovingPlayer = {
            player,
            listIndex,
            newTeam: this.getTeamNumber(this.teamName),
        };
        this.switchPlayerToNewTeam.emit(playerToMove);
    }

    private getTeamNumber(teamName: string) {
        return 'Team 2' === teamName
            ? 2
            : 1;
    }

    dragStart(data: any) {
        this.onDragStart.emit(data);
    }

    dragDrop(data: DataTransfer) {
        if (data.player) {
            const playerToMove = {
                player: data.player,
                listIndex: data.dropZoneIndex,
                newTeam: this.getTeamNumber(data.teamList),
            };
            this.switchPlayerToNewTeam.emit(playerToMove);
        }
        this.dragEnd();
    }

    dragEnd() {
        this.onDragStart.emit({});
    }

    dropZoneIsAroundDataTransferPlayer(index: number, data: DataTransfer) {
        if (!data) {
            return false;
        }
        const isSurroundingDropZone = isEqual(get(data, 'player.teamPlayerIndex'), index)
            || isEqual(get(data, 'player.teamPlayerIndex') + 1, index);
        return isEqual(get(data, 'player.team'), this.teamId)
            && isSurroundingDropZone;
    }
}
