import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { PlayerService } from '../../player/player.service';
import { RoomService } from '../../room/room.service';
import { RouteGuardService } from '../../router-guards/router-guards.service';

import { Player } from '../../interfaces/player.model';
import { Room } from '../../interfaces/room.model';

import { take, tap } from 'rxjs/operators';

@Component({
    selector: 'app-game-over-view',
    templateUrl: './game-over-view.component.html',
    styleUrls: ['./game-over-view.component.scss'],
})
export class GameOverViewComponent implements OnInit {
    playerState: Observable<Player>;
    roomState: Observable<Room>;
    isLoading = true;
    playerIsLoading = true;

    constructor(private routeGuardService: RouteGuardService,
                public route: ActivatedRoute,
                private playerService: PlayerService,
                private roomService: RoomService) {
        this.route.paramMap.pipe(
            take(1),
            tap(() => {
                this.routeGuardService.returnToWordsFormViewOnPlayAgain();
            }),
        ).subscribe();
    }

    ngOnInit() {
        const name = this.route.snapshot.paramMap.get('name');
        const roomCode = this.route.snapshot.paramMap.get('code');
        this.roomState = this.roomService.getRoomByCode(roomCode)
            .pipe(
                tap((room: Room) => {
                    this.getPlayerByNameForRoom(room, name);
                    this.isLoading = false;
                }),
            );
    }

    playAgain(room: Room) {
        this.roomService.initializeRoom(room);
    }

    getPlayerByNameForRoom(room: Room, name: string) {
        this.playerState = this.playerService.getPlayerByName(room, name)
            .pipe(
                tap(() => {
                    this.playerIsLoading = false;
                }),
            );
    }
}
