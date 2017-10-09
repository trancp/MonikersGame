import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Store} from '@ngrx/store';

import {CreatePlayer, GetPlayer, UpdatePlayer, SetPlayer} from './player.actions';

import findKey from 'lodash-es/findKey';
import filter from 'lodash-es/filter';
import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';
import sortBy from 'lodash-es/sortBy';

import {AppState} from '../app.state';

@Injectable()
export class PlayerService {

    constructor(private db: AngularFireDatabase,
                private store: Store<AppState>) {
    }

    public getAvailableTeam(room: any) {
        const teamOnePlayers = this.getTeamPlayers(room.players, 1);
        const teamTwoPlayers = this.getTeamPlayers(room.players, 2);
        return teamTwoPlayers.length < teamOnePlayers.length
            ? 2
            : 1;
    }

    public getPlayerIndexForTeam(teamToJoin: number, players: any[]) {
        return get(this.getTeamPlayers(players, teamToJoin), 'length', 0);
    }

    public getPlayerKey(players: any[], name: string): number {
        return findKey(players, {name});
    }

    public dispatchUpdatePlayer(update: any): void {
        this.store.dispatch(UpdatePlayer(update));
    }

    public dispatchGetPlayer(name: string): void {
        this.store.dispatch(GetPlayer(name));
    }

    public dispatchSetPlayer(player: any): void {
        this.store.dispatch(SetPlayer(player));
    }

    public dispatchCreatePlayer(name: string): void {
        this.store.dispatch(CreatePlayer(name));
    }

    public getTeamPlayers(players: any[], team: number) {
        return sortBy(filter(players, player => isEqual(team, player.team)), 'teamPlayerIndex');
    }
}
