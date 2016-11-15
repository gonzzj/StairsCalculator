import {Component, Input} from '@angular/core';

@Component({
    selector: 'total',
    template: require('./total.html')
})
export class TotalComponent {
  @Input() total: number;
}
