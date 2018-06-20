import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take, tap } from 'rxjs/operators';

import { RoomService } from '../../room/room.service';
import { PlayerService } from '../../player/player.service';
import { DialogService } from '../../dialog/dialog.service';

import { DialogConfirmPromptComponent } from '../../dialog/dialog-confirm-prompt/dialog-confirm-prompt.component';

import { Observable } from 'rxjs';

import find from 'lodash-es/find';
import get from 'lodash-es/get';
import isEqual from 'lodash-es/isEqual';
import random from 'lodash-es/random';

import { AppState } from '../../app.state';
import { Player } from '../../interfaces/player.model';

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

export class CreateViewComponent implements OnInit {
    inputPlaceholder: string;
    inputName: string;
    isJoiningGame: boolean;
    room$: Observable<any>;

    constructor(private dialogService: DialogService,
                public route: ActivatedRoute,
                private router: Router,
                private roomService: RoomService,
                private playerService: PlayerService,
                private store: Store<AppState>) {
        this.route.paramMap
            .subscribe((params: ParamMap) => {
                const code = params.get('code');
                this.roomService.dispatchGetRoom(code);
                this.room$ = this.store.select('room');
            });
    }

    ngOnInit(): void {
        this.inputPlaceholder = this._getRandomInputPlaceholder();
        this.inputName = '';
        this.isJoiningGame = isEqual('join', get(this.route, 'url.value[0].path'));
    }

    public goBack(): void {
        const backState = this.isJoiningGame
            ? '/join'
            : '/';
        this.router.navigate([backState]);
    }

    public onSubmit(formInput: string): void {
        this.inputName = formInput
            || this.inputPlaceholder;
    }

    public onGoToWords(room: any, name: string): void {
        if (!name) {
            return;
        }
        const playerAlreadyInRoom = find(room.players, (player: Player) => isEqual(player.name, name));
        const nextStateUrl = this._generateNextStateUrl(room.code, name);
        if (playerAlreadyInRoom) {
            const context = {
                ...CONFIRM_AS_EXISTING_USER_PROMPT,
                title: CONFIRM_AS_EXISTING_USER_PROMPT.title(name),
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
        this.playerService.dispatchCreatePlayer(name);
        this.router.navigate([nextStateUrl]);
    }

    private _generateNextStateUrl(code: string, name: string): string {
        const nextState = this.isJoiningGame
            ? '/join'
            : '/create';
        return `${nextState}/${code}/${name}/words`;
    }

    private _getRandomInputPlaceholder() {
        const placeholderIndex = random(INPUT_PLACEHOLDERS.length - 1);
        return INPUT_PLACEHOLDERS[placeholderIndex];
    }
}
