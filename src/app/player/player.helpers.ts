import { Player } from '../interfaces/player.model';

import findKey from 'lodash-es/findKey';
import filter from 'lodash-es/filter';
import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';
import sortBy from 'lodash-es/sortBy';

export function getTeamPlayers(players: Player[], team: number) {
    return sortBy(filter(players, player => isEqual(team, player.team)), 'teamPlayerIndex');
}

export function getAvailableTeam(room: any) {
    const teamOnePlayers = getTeamPlayers(room.players, 1);
    const teamTwoPlayers = getTeamPlayers(room.players, 2);
    return teamTwoPlayers.length < teamOnePlayers.length
        ? 2
        : 1;
}

export function getPlayerIndexForTeam(teamToJoin: number, players: any[]) {
    return get(getTeamPlayers(players, teamToJoin), 'length', 0);
}

export function getPlayerKey(players: Player[], name: string): number {
    return findKey(players, (player: Player) => isEqual(player.name, name));
}
