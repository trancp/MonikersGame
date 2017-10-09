import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import get from 'lodash-es/get';
import some from 'lodash-es/some';
import values from 'lodash-es/values';

import { Player } from '../interfaces/player.model';
import { DataTransfer } from '../data-transfer/data-transfer.model';

@Component({
    selector: 'app-name-tag',
    templateUrl: './name-tag.component.html',
    styleUrls: ['./name-tag.component.scss']
})
export class NameTagComponent implements OnInit {
    @Input() alignment: string;
    @Input() player: Player;
    @Input() user: Player;
    @Output() onDragStart: EventEmitter<any> = new EventEmitter();
    @Output() onDragDrop: EventEmitter<any> = new EventEmitter();
    @Input() id: string;
    dragStart: boolean;
    defaultX: string;
    defaultY: string;
    @Input() dataToTransfer: DataTransfer;

    ngOnInit() {
    }

    startDrag(event) {
        if (event.dataTransfer) {
            const playerDataStringify = JSON.stringify(this.player);
            event.dataTransfer.setData('player', playerDataStringify);
        }
        this.dragStart = true;
    }

    endDrag() {
        this.dragStart = false;
    }

    touched(event: any) {
        if (!this.user.vip) {
            return;
        }
        const dragElement = document.getElementById(this.id);
        const touchLocation = event.targetTouches[0];
        if (!this.dragStart) {
            this.defaultX = touchLocation.pageX;
            this.defaultY = touchLocation.pageY;
        }
        dragElement.style.position = 'absolute';
        const pointX = touchLocation.pageX - Math.floor(dragElement.clientWidth / 2);
        const pointY = touchLocation.pageY - Math.floor(dragElement.clientHeight / 2);
        dragElement.style.left = `${pointX}px`;
        dragElement.style.top = `${pointY}px`;
        this.onDragStart.emit({ player: this.player, posX: touchLocation.clientX, posY: touchLocation.clientY, dropZones: {} });
        this.startDrag(event);
    }

    touchEnd() {
        if (some(values(get(this.dataToTransfer, 'dropZones', {})), (dropZoneIsActive: boolean) => dropZoneIsActive)) {
            return this.onDragDrop.emit(this.dataToTransfer);
        }
        const dragElement = document.getElementById(this.id);
        dragElement.style.left = this.defaultX;
        dragElement.style.top = this.defaultY;
        dragElement.style.position = '';
        this.endDrag();
        this.onDragDrop.emit({});
    }
}
