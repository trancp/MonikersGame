import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { PlayerService } from '../../player/player.service';
import { RoomService } from '../../room/room.service';
import { RouteGuardService } from '../../router-guards/router-guards.service';

import { AppState } from '../../app.state';
import { Player } from '../../interfaces/player.model';
import { Room } from '../../interfaces/room.model';

import { take } from 'rxjs/operators/take';
import { tap } from 'rxjs/operators/tap';

@Component({
    selector: 'app-game-over-view',
    templateUrl: './game-over-view.component.html',
    styleUrls: ['./game-over-view.component.scss'],
})
export class GameOverViewComponent {
    playerState: Observable<Player> = this.store.select('player');
    roomState: Observable<Room> = this.store.select('room');

    constructor(private routeGuardService: RouteGuardService,
                public route: ActivatedRoute,
                private playerService: PlayerService,
                private roomService: RoomService,
                private store: Store<AppState>) {
        this.route.paramMap.pipe(
            take(1),
            tap((params: ParamMap) => {
                const code = params.get('code');
                const name = params.get('name');
                this.roomService.dispatchGetRoom(code);
                this.playerService.dispatchGetPlayer(name);
                this.playerState.subscribe();
                this.roomState.subscribe();
                this.routeGuardService.returnToWordsFormViewOnPlayAgain();
            }),
        ).subscribe();
    }

    playerAgain() {
        this.roomService.dispatchInitializeRoom();
    }
}
