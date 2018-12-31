declare let window: any;

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Location } from '@angular/common';

import { RoomService } from '../../room/room.service';
import { PlayerService } from '../../player/player.service';
import { DialogService } from '../../dialog/dialog.service';

import { DialogConfirmPromptComponent } from '../../dialog/dialog-confirm-prompt/dialog-confirm-prompt.component';

import { buildPlayerSlug } from '../../player/player.helpers';

import find from 'lodash-es/find';
import isEqual from 'lodash-es/isEqual';
import random from 'lodash-es/random';

import { Player } from '../../interfaces/player.model';
import { FormControl } from '@angular/forms';
import { Room } from '../../interfaces/room.model';

const INPUT_PLACEHOLDERS = [
    'Asshat',
    'Yeezus',
    'Dickhead',
    'Ayy Lmao',
    'Cunt',
    'Donald',
    'Draymond',
    'Elon',
    'Lebron',
    'Mr. Juice',
    'Jon Snow',
    'Seal',
    'Cher',
    'Biebs',
    'Kungfu Kenny',
    'Bernie',
    'Bitchass',
];

const CONFIRM_AS_EXISTING_USER_PROMPT = {
    title: (name: string) => `"${name}" is already in the room, continue as "${name}"?`,
    cancel: 'No',
    confirm: 'Yeah',
    content: '',
};

@Component({
    selector: 'app-create-view',
    templateUrl: './create-view.component.html',
    styleUrls: ['./create-view.component.scss'],
})

export class CreateViewComponent implements OnInit, OnDestroy {
    inputPlaceholder: string;
    form = new FormControl();
    roomState = new BehaviorSubject<Room>({});
    isLoading = true;
    componentDestroy = new Subject();

    constructor(private dialogService: DialogService,
                private location: Location,
                public route: ActivatedRoute,
                private router: Router,
                private roomService: RoomService,
                private playerService: PlayerService) {
    }

    ngOnInit(): void {
        const roomCode = this.route.snapshot.paramMap.get('code');
        this.roomService.getRoomByCode(roomCode)
            .pipe(
                takeUntil(this.componentDestroy),
                tap((room: Room) => {
                    this.roomState.next(room);
                    this.isLoading = false;
                }),
            )
            .subscribe();
        this.inputPlaceholder = this._getRandomInputPlaceholder();
    }

    ngOnDestroy() {
        this.componentDestroy.next();
        this.componentDestroy.complete();
    }

    public goBack() {
        return 1 === window.history.length
            ? this.router.navigate(['/'])
            : this.location.back();
    }

    public onSubmit(formInput: string): void {
        const inputName = formInput
            || this.inputPlaceholder;
        this.form.patchValue(inputName);
    }

    public onGoToWords(name: string): void {
        if (!name) {
            return;
        }
        const slug = buildPlayerSlug(name);
        const room = this.roomState.getValue();
        const playerAlreadyInRoom = find(room.players, (player: Player) => isEqual(player.slug, slug));
        const nextStateUrl = `/${room.code}/${slug}/words`;
        if (playerAlreadyInRoom) {
            const context = {
                ...CONFIRM_AS_EXISTING_USER_PROMPT,
                title: CONFIRM_AS_EXISTING_USER_PROMPT.title(playerAlreadyInRoom.name),
            };
            const config = {
                component: DialogConfirmPromptComponent,
                config: {
                    data: context,
                },
            };
            this.dialogService.openDialogComponent(config).afterClosed().pipe(
                filter((data: any) => data),
                take(1),
                tap(() => {
                    this.router.navigate([nextStateUrl]);
                }),
            ).subscribe();
            return;
        }
        this.playerService.createPlayer(room, name);
        this.router.navigate([nextStateUrl]);
    }

    private _getRandomInputPlaceholder() {
        const placeholderIndex = random(INPUT_PLACEHOLDERS.length - 1);
        return INPUT_PLACEHOLDERS[placeholderIndex];
    }
}
