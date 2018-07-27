import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { RoomService } from '../../room/room.service';
import { RoomsService } from '../../rooms/rooms.service';
import { ToastService } from '../../toast/toast.service';

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
export class MainViewComponent implements OnInit, OnDestroy {
    roomsLoaded = new BehaviorSubject(false);
    isLoading = false;
    roomsState = new BehaviorSubject([]);
    componentDestroy = new Subject();

    constructor(private roomService: RoomService,
                private roomsService: RoomsService,
                private router: Router,
                private toastService: ToastService) {
    }

    ngOnInit() {
         this.roomsService.getAllRooms()
            .pipe(
                takeUntil(this.componentDestroy),
                tap((rooms: Room[]) => {
                    this.roomsState.next(rooms);
                    this.roomsLoaded.next(true);
                }),
            )
             .subscribe();
    }

    ngOnDestroy() {
        this.componentDestroy.next();
        this.componentDestroy.complete();
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
