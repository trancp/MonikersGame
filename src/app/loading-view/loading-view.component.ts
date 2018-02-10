import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-view',
  templateUrl: './loading-view.component.html',
  styleUrls: ['./loading-view.component.scss'],
})
export class LoadingViewComponent {
    @Input() color: string;
}
