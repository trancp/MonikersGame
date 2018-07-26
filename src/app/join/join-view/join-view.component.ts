import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { RoomsService } from '../../rooms/rooms.service';
import { ToastService } from '../../toast/toast.service';

import { AppState } from '../../app.state';
import { Room } from '../../interfaces/room.model';
import { roomExists } from '../../rooms/rooms.helpers';

const INPUT_CODE_LENGTH = 4;
const ERROR_ROOM_DOES_NOT_EXIST = 'Wrong code bro.';

@Component({
    selector: 'app-join-view',
    templateUrl: './join-view.component.html',
    styleUrls: ['./join-view.component.scss'],
})
export class JoinViewComponent implements OnInit {
    inputCode: string;
    inputFocused: boolean;
    roomsState: Observable<Room[]>;
    isLoading = true;

    constructor(private router: Router,
                private roomsService: RoomsService,
                private store: Store<AppState>,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.inputFocused = false;
        this.inputCode = '';
        this.roomsState = this.roomsService.getAllRooms()
            .pipe(
                tap(() => {
                    this.isLoading = false;
                }),
            );
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

    toggleFocus() {
        this.inputFocused = !this.inputFocused;
    }

    hasInputCode() {
        return INPUT_CODE_LENGTH === this.inputCode.length;
    }
}
