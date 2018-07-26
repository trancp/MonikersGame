import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter, take, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs';

import { RoomService } from '../../room/room.service';
import { RoomsService } from '../../rooms/rooms.service';
import { ToastService } from '../../toast/toast.service';

import { AppState } from '../../app.state';
import { Room } from '../../interfaces/room.model';
import { findNewRoomCode } from '../../room/room.helpers';

const ERRORS = {
    maxRooms: 'Sorry there are no available rooms!',
};

@Component({
    selector: 'app-main-view',
    templateUrl: './main-view.component.html',
    styleUrls: ['./main-view.component.scss'],
})
export class MainViewComponent implements OnInit {
    roomsLoaded = new BehaviorSubject(false);
    isLoading = false;
    roomsState: Observable<Room[]>;

    constructor(private roomService: RoomService,
                private roomsService: RoomsService,
                private router: Router,
                private store: Store<AppState>,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.roomsState = this.roomsService.getAllRooms()
            .pipe(
                tap(() => {
                    this.roomsLoaded.next(true);
                }),
            );
    }

    startAGame() {
        this.isLoading = true;
        combineLatest([this.roomsLoaded, this.roomsState]).pipe(
            filter(([isLoaded]: [boolean]) => isLoaded),
            take(1),
            tap(([isLoaded, rooms]: [boolean, Room[]]) => {
                const newRoomCode = findNewRoomCode(rooms);
                if (!newRoomCode) {
                    this.isLoading = false;
                    return this.toastService.showError(ERRORS.maxRooms);
                }
                this.roomService.createRoom(newRoomCode);
                return this.router.navigate([`/create/${newRoomCode}`]);
            }),
        ).subscribe();
    }
}
