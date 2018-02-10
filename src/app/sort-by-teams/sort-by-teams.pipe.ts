import { Pipe, PipeTransform } from '@angular/core';

import { Player } from '../interfaces/player.model';

import filter from 'lodash-es/filter';
import isEqual from 'lodash-es/isEqual';
import map from 'lodash-es/map';
import sortBy from 'lodash-es/sortBy';

@Pipe({
    name: 'appSortByTeams',
})
export class SortByTeamsPipe implements PipeTransform {
    transform(players: Player[]) {
        const teamOne = {
            players: sortBy(filter(this.appendPlayerIds(players), player => isEqual(1, player.team)), 'teamPlayerIndex'),
            teamName: 'Team 1',
            listAlignment: 'start',
        };
        const teamTwo = {
            players: sortBy(filter(this.appendPlayerIds(players), player => isEqual(2, player.team)), 'teamPlayerIndex'),
            teamName: 'Team 2',
            listAlignment: 'end',
        };
        return [teamOne, teamTwo];
    }

    appendPlayerIds(players: Player[]): Player[] {
        return map(players, (player: Player, key: string) => {
            return {
                ...player,
                id: key,
            };
        });
    }
}
