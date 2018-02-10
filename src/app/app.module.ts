import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MatProgressSpinnerModule, } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ToastModule } from './toast/toast.module';
import { SortByTeamsModule } from './sort-by-teams/sort-by-teams.module';
import { RouterGuardsModule } from './router-guards/router-guards.module';
import { DialogModule } from './dialog/dialog.module';
import { DialogConfirmPromptModule } from './dialog-confirm-prompt/dialog-confirm-prompt.module';
import { WinningTeamPipeModule } from './winning-team-pipe/winning-team-pipe.module';

import { AppComponent } from './app.component';
import { CreateViewComponent } from './create-view/create-view.component';
import { MainViewComponent } from './main-view/main-view.component';
import { JoinViewComponent } from './join-view/join-view.component';
import { WordsFormViewComponent } from './words-form-view/words-form-view.component';
import { RoomViewComponent } from './room-view/room-view.component';
import { WaitingViewComponent } from './waiting-view/waiting-view.component';
import { NameTagComponent } from './name-tag/name-tag.component';
import { PlayersListComponent } from './players-list/players-list.component';
import { NameDropZoneComponent } from './name-drop-zone/name-drop-zone.component';
import { LoadingViewComponent } from './loading-view/loading-view.component';
import { GameViewComponent } from './game-view/game-view.component';
import { ScoreBoardComponent } from './score-board/score-board.component';
import { TimerComponent } from './timer/timer.component';
import { WordComponent } from './word/word.component';
import { ThreeLineTextComponent } from './three-line-text/three-line-text.component';

import { RoomService } from './room/room.service';
import { RoomsService } from './rooms/rooms.service';
import { PlayerService } from './player/player.service';

import { roomReducer } from './room/room.reducer';
import { roomsReducer } from './rooms/rooms.reducer';
import { playerReducer } from './player/player.reducer';
import { RoomEffects } from './room/room.effects';
import { RoomsEffects } from './rooms/rooms.effects';
import { PlayerEffects } from './player/player.effects';
import { GameOverViewComponent } from './game-over-view/game-over-view.component';

export const firebaseConfig = {
    apiKey: 'AIzaSyDDYJxYt4TVIJo_TGP_0Ii-WE9yUrhK1c4',
    authDomain: 'monikersgame.firebaseapp.com',
    databaseURL: 'https://monikersgame.firebaseio.com',
    projectId: 'monikersgame',
    storageBucket: '',
    messagingSenderId: '355956033923',
};

const routes: Routes = [
    {
        path: '',
        component: MainViewComponent,
    },
    {
        path: 'create/:code',
        component: CreateViewComponent,
    },
    {
        path: 'create/:code/:name/words',
        component: WordsFormViewComponent,
    },
    {
        path: 'join',
        component: JoinViewComponent,
    },
    {
        path: 'join/:code',
        component: CreateViewComponent,
    },
    {
        path: 'join/:code/:name/words',
        component: WordsFormViewComponent,
    },
    {
        path: 'room/:code/:name',
        component: RoomViewComponent,
    },
    {
        path: 'game/:code/:name',
        component: GameViewComponent,
    },
    {
        path: 'waiting/:code/:name',
        component: WaitingViewComponent,
    },
    {
        path: 'gameover/:code/:name',
        component: GameOverViewComponent,
    },
];

@NgModule({
    declarations: [
        AppComponent,
        CreateViewComponent,
        MainViewComponent,
        JoinViewComponent,
        WordsFormViewComponent,
        RoomViewComponent,
        WaitingViewComponent,
        NameTagComponent,
        PlayersListComponent,
        NameDropZoneComponent,
        LoadingViewComponent,
        GameViewComponent,
        ScoreBoardComponent,
        TimerComponent,
        WordComponent,
        ThreeLineTextComponent,
        GameOverViewComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        DialogConfirmPromptModule,
        DialogModule,
        FormsModule,
        HttpClientModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        FlexLayoutModule,
        RouterModule.forRoot(routes),
        BrowserAnimationsModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        EffectsModule.forRoot([RoomsEffects, RoomEffects, PlayerEffects]),
        RouterGuardsModule,
        SortByTeamsModule,
        StoreModule.forRoot({
            rooms: roomsReducer,
            room: roomReducer,
            player: playerReducer,
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
        }),
        ToastModule,
        WinningTeamPipeModule,
    ],
    providers: [
        RoomService,
        RoomsService,
        PlayerService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
