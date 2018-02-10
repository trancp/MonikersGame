import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
        path: '',
        loadChildren: './main/main.module#MainModule',
    },
    {
        path: 'create',
        loadChildren: './create/create.module#CreateModule',
    },
    {
        path: 'join',
        loadChildren: './join/join.module#JoinModule',
    },
    {
        path: 'room',
        loadChildren: './room/room.module#RoomModule',
    },
    {
        path: 'game',
        loadChildren: './game/game.module#GameModule',
    },
    {
        path: 'waiting',
        loadChildren: './waiting-view/waiting-view.module#WaitingViewModule',
    },
];
