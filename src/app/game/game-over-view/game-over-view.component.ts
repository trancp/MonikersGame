import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { PlayerService } from '../../player/player.service';
import { RoomService } from '../../room/room.service';
import { RouteGuardService } from '../../router-guards/router-guards.service';

import { AppState } from '../../app.state';
import { Player } from '../../interfaces/player.model';
import { Room } from '../../interfaces/room.model';

import { take, tap } from 'rxjs/operators';

@Component({
    selector: 'app-game-over-view',
    templateUrl: './game-over-view.component.html',
    styleUrls: ['./game-over-view.component.scss'],
})
export class GameOverViewComponent implements OnInit {
    playerState: Observable<Player> = this.store.select('player');
    roomState: Observable<Room>;
    isLoading = false;

    constructor(private routeGuardService: RouteGuardService,
                public route: ActivatedRoute,
                private playerService: PlayerService,
                private roomService: RoomService,
                private store: Store<AppState>) {
        this.route.paramMap.pipe(
            take(1),
            tap((params: ParamMap) => {
                const name = params.get('name');
                this.playerService.dispatchGetPlayer(name);
                this.playerState.subscribe();
                this.routeGuardService.returnToWordsFormViewOnPlayAgain();
            }),
        ).subscribe();
    }

    ngOnInit() {
        this.isLoading = true;
        const roomCode = this.route.snapshot.paramMap.get('code');
        this.roomState = this.roomService.getRoomByCode(roomCode)
            .pipe(
                tap(() => {
                   this.isLoading = false;
                }),
            );
    }

    playerAgain() {
        this.roomService.dispatchInitializeRoom();
    }
}
