import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';

import { DataTransfer } from '../data-transfer/data-transfer.model';
import defer from 'lodash-es/defer';
import get from 'lodash-es/get';
import isEmpty from 'lodash-es/isEmpty';

@Component({
    selector: 'app-name-drop-zone',
    templateUrl: './name-drop-zone.component.html',
    styleUrls: ['./name-drop-zone.component.scss'],
})
export class NameDropZoneComponent implements OnInit, OnChanges {
    @Input() alignment: string;
    @Output() onDropEmitted: EventEmitter<any> = new EventEmitter();
    dropZoneActive: boolean;
    @Input() dataToTransfer: DataTransfer;
    @ViewChild('dropZone') private dropZoneElement: ElementRef;
    bottom: number;
    top: number;
    left: number;
    right: number;
    @Input() dropZoneIndex: number;
    @Input() teamName: string;
    dropZoneActiveEmitter: number;
    emitterIsActive = false;

    ngOnInit() {
        defer(() => {
            const boundingBox = this.dropZoneElement.nativeElement.getBoundingClientRect();
            this.setBoundingBox(boundingBox);
        });
    }

    ngOnChanges(changes) {
        if (!isEmpty(get(changes, 'dataToTransfer.currentValue')) && !this.emitterIsActive) {
            this.isDropZoneActive();
            this.emitterIsActive = true;
            this.createSetIntervalForIsDropZoneActive();
        }
        const shouldClearInterval = isEmpty(get(changes, 'dataToTransfer.currentValue'))
            && !isEmpty(get(changes, 'dataToTransfer.previousValue'))
            && this.emitterIsActive;
        if (shouldClearInterval) {
            clearInterval(this.dropZoneActiveEmitter);
            this.dropZoneActive = false;
            this.emitterIsActive = false;
        }
    }

    setBoundingBox({ right, top, left, bottom }: any) {
        this.right = right;
        this.top = top;
        this.left = left;
        this.bottom = bottom;
    }

    toggleDragZoneActive() {
        this.dropZoneActive = !this.dropZoneActive;
    }

    dragOver(event) {
        event.preventDefault();
    }

    dropped(event) {
        this.toggleDragZoneActive();
        this.onDropEmitted.emit(event);
    }

    createSetIntervalForIsDropZoneActive() {
        this.dropZoneActiveEmitter = window.setInterval(() => this.isDropZoneActive(), 100);
    }

    isDropZoneActive() {
        const dropZoneActive = this.left <= this.dataToTransfer.posX
            && this.dataToTransfer.posX <= this.right
            && this.top <= this.dataToTransfer.posY
            && this.dataToTransfer.posY <= this.bottom;
        this.dataToTransfer.dropZones[`${this.teamName}${this.dropZoneIndex}`] = dropZoneActive;
        this.dropZoneActive = dropZoneActive;
        if (!dropZoneActive) {
            return;
        }
        this.dataToTransfer.dropZoneIndex = this.dropZoneIndex;
        this.dataToTransfer.teamList = this.teamName;
    }
}
