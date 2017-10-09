import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { RoomsService } from '../rooms/rooms.service';
import { ToastService } from '../toast/toast.service';

import { AppState } from '../app.state';
import { Rooms } from '../interfaces/rooms.model';

const INPUT_CODE_LENGTH = 4;
const ERROR_ROOM_DOES_NOT_EXIST = 'Wrong code bro.';

@Component({
    selector: 'app-join-view',
    templateUrl: './join-view.component.html',
    styleUrls: ['./join-view.component.scss']
})
export class JoinViewComponent implements OnInit {
    inputCode: string;
    inputFocused: boolean;
    roomsState: Observable<Rooms> = this.store.select('rooms');

    constructor(private router: Router,
                private roomsService: RoomsService,
                private store: Store<AppState>,
                private toastService: ToastService) {
        this.roomsService.dispatchGetRooms();
    }

    ngOnInit() {
        this.inputFocused = false;
        this.inputCode = '';
    }

    goToCreate(rooms: Rooms, inputCode: string) {
        if (!inputCode) {
            return;
        }
        if (!this.roomsService.roomExists(rooms, inputCode)) {
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
