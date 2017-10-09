import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-three-line-text',
    templateUrl: './three-line-text.component.html',
    styleUrls: ['./three-line-text.component.scss']
})
export class ThreeLineTextComponent {
    @Input() lineOne: string;
    @Input() lineTwo: string;
    @Input() lineThree: string;
}
