import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-room-code',
    templateUrl: './room-code.component.html',
})
export class RoomCodeComponent {
    @Input() roomCode: string;
}
