import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormControl } from '@angular/forms';

import { RoomsService } from '../../rooms/rooms.service';
import { ToastService } from '../../toast/toast.service';

import { Room } from '../../interfaces/room.model';
import { roomExists } from '../../rooms/rooms.helpers';

const INPUT_CODE_LENGTH = 4;
const ERROR_ROOM_DOES_NOT_EXIST = 'Wrong code bro.';

@Component({
    selector: 'app-join-view',
    templateUrl: './join-view.component.html',
    styleUrls: ['./join-view.component.scss'],
})
export class JoinViewComponent implements OnInit, OnDestroy {
    roomsState = new BehaviorSubject([]);
    isLoading = true;
    componentDestroy = new Subject();
    form = new FormControl('');

    constructor(private router: Router,
                private roomsService: RoomsService,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.roomsService.getAllRooms()
            .pipe(
                takeUntil(this.componentDestroy),
                tap((room: Room[]) => {
                    this.roomsState.next(room);
                    this.isLoading = false;
                }),
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.componentDestroy.next();
        this.componentDestroy.complete();
    }

    goToCreate(rooms: Room[], inputCode: string) {
        if (!inputCode) {
            return;
        }
        if (!roomExists(rooms, inputCode)) {
            return this.toastService.showError(ERROR_ROOM_DOES_NOT_EXIST);
        }
        return this.router.navigate([`/join/${inputCode}`]);
    }

    hasInputCode() {
        return INPUT_CODE_LENGTH === this.form.value.length;
    }
}
