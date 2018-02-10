import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import isEqual from 'lodash-es/isEqual';
import max from 'lodash-es/max';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit {
    @Input() stopTime: string;
    @Output() onTimerEnd: EventEmitter<any> = new EventEmitter();
    diameter = 90;
    strokeWidth = 10;
    timeLeft: number;
    value: number;

    ngOnInit() {
        this.setTimerValues(this.stopTime);
        const timer = setInterval(() => {
            this.setTimerValues(this.stopTime);
            if (isEqual(0, this.timeLeft)) {
                clearInterval(timer);
                return this.onTimerEnd.emit();
            }
        }, 1000);
    }

    public getTimeLeft(time: string): number {
        const stopTime = new Date(time);
        const now = new Date();
        const timeLeft = Math.floor((stopTime.getTime() - now.getTime()) / 1000);
        return max([timeLeft, 0]);
    }

    private setTimerValues(stopTime: string): void {
        this.timeLeft = this.getTimeLeft(stopTime);
        this.value = (60 - this.timeLeft) / 60 * 100;
    }
}
