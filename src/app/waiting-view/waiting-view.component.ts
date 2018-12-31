import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { PlayerService } from '../player/player.service';
import { RoomService } from '../room/room.service';
import { RouteGuardService } from '../router-guards/router-guards.service';

import { Player } from '../interfaces/player.model';
import { Room } from '../interfaces/room.model';

const WAITING_TEXT = [
    `${'<div>'}Hey,${'</div>'}${'<div>'}sit back and${'</div>'}${'<div>'}fucking chill...${'</div>'}`,
    `${'<div>'}Game${'</div>'}${'<div>'}Is starting${'</div>'}${'<div>'}soon bro.${'</div>'}`,
    `${'<div>'}Calm${'</div>'}${'<div>'}the fuck${'</div>'}${'<div>'}down.${'</div>'}`,
];

@Component({
    selector: 'app-waiting-view',
    templateUrl: './waiting-view.component.html',
    styleUrls: ['./waiting-view.component.scss'],
})
export class WaitingViewComponent implements OnDestroy, OnInit {
    playerState: BehaviorSubject<Player> = new BehaviorSubject({ loading: true });
    roomState: BehaviorSubject<Room> = new BehaviorSubject({ loading: true });
    WAITING_TEXT: string[] = WAITING_TEXT;
    componentDestroy = new Subject();

    constructor(private routeGuardService: RouteGuardService,
                public route: ActivatedRoute,
                private playerService: PlayerService,
                private roomService: RoomService,
                private router: Router) {
    }

    ngOnInit() {
        const slug = this.route.snapshot.paramMap.get('slug');
        const roomCode = this.route.snapshot.paramMap.get('code');
        this.roomService.getRoomByCode(roomCode)
            .pipe(
                takeUntil(this.componentDestroy),
                tap((room: Room) => {
                    this.roomState.next(room);
                    this.getPlayerByNameForRoom(room, slug)
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
        this.roomState.pipe(
            filter((room: Room) => room.started),
            take(1),
            tap((room: Room) => this.router.navigate([room.code, slug, 'game'])),
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.componentDestroy.next();
        this.componentDestroy.complete();
    }

    getPlayerByNameForRoom(room: Room, slug: string) {
        return this.playerService.getPlayerByName(room, slug)
            .pipe(
                tap((player: Player) => {
                    this.playerService.updatePlayerProperties(player, { ready: true });
                }),
            );
    }
}
