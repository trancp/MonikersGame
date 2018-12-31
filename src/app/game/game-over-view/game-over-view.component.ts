import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { PlayerService } from '../../player/player.service';
import { RoomService } from '../../room/room.service';
import { RouteGuardService } from '../../router-guards/router-guards.service';

import { Player } from '../../interfaces/player.model';
import { Room } from '../../interfaces/room.model';

@Component({
    selector: 'app-game-over-view',
    templateUrl: './game-over-view.component.html',
    styleUrls: ['./game-over-view.component.scss'],
})
export class GameOverViewComponent implements OnInit, OnDestroy {
    playerState: BehaviorSubject<Player> = new BehaviorSubject({ loading: true });
    roomState: BehaviorSubject<Room> = new BehaviorSubject({ loading: true });
    componentDestroy = new Subject();

    constructor(private routeGuardService: RouteGuardService,
                public route: ActivatedRoute,
                private playerService: PlayerService,
                private roomService: RoomService) {
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            take(1),
            tap(() => {
                this.routeGuardService.returnToWordsFormViewOnPlayAgain(this.roomState, this.playerState);
            }),
        ).subscribe();
        const slug = this.route.snapshot.paramMap.get('slug');
        const roomCode = this.route.snapshot.paramMap.get('code');
        this.roomService.getRoomByCode(roomCode)
            .pipe(
                takeUntil(this.componentDestroy),
                tap((room: Room) => {
                    this.roomState.next(room);
                    this.playerService.getPlayerByName(room, slug)
                        .pipe(
                            takeUntil(this.componentDestroy),
                            tap((player: Player) => {
                                this.playerState.next(player);
                            }),
                        )
                        .subscribe();
                }),
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.componentDestroy.next();
        this.componentDestroy.complete();
    }

    playAgain(room: Room) {
        this.roomService.initializeRoom(room);
    }
}
