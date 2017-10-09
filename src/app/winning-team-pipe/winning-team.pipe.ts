import { Pipe, PipeTransform } from '@angular/core';

import get from 'lodash-es/get';
import find from 'lodash-es/find';
import isEqual from 'lodash-es/isEqual';
import map from 'lodash-es/map';
import max from 'lodash-es/max';

@Pipe({
    name: 'appWinningTeam'
})
export class WinningTeamPipe implements PipeTransform {
    transform(teams: any) {
        const scores = map(teams, (team: any) => get(team, 'words.length', 0));
        const winningScore = max(scores);
        return find(teams, (team: any) => isEqual(get(team, 'words.length', 0), winningScore));
    }
}
