import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { RoomService } from '../../room/room.service';
import { RoomsService } from '../../rooms/rooms.service';
import { ToastService } from '../../toast/toast.service';

import { AppState } from '../../app.state';
import { Rooms } from '../../interfaces/rooms.model';
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
    isLoading = false;
    rooms$ = this.store.select('rooms');

    constructor(private roomService: RoomService,
                private roomsService: RoomsService,
                private router: Router,
                private store: Store<AppState>,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.roomsService.dispatchGetRooms();
    }

    startAGame(rooms: Rooms) {
        const newRoomCode = findNewRoomCode(rooms);
        if (!newRoomCode) {
            return this.toastService.showError(ERRORS.maxRooms);
        }
        this.roomService.createRoom(newRoomCode);
        return this.router.navigate([`/create/${newRoomCode}`]);
    }
}
