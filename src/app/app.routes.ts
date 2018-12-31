import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
        path: '',
        loadChildren: './main/main.module#MainModule',
    },
    {
        path: 'join',
        loadChildren: './join/join.module#JoinModule',
    },
    {
        path: ':code',
        loadChildren: './create/create.module#CreateModule',
    },
];
