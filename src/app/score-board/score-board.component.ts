import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-score-board',
    templateUrl: './score-board.component.html',
    styleUrls: ['./score-board.component.scss'],
})
export class ScoreBoardComponent {
    @Input() room: any;
}
