import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'technical-data',
    template: require('./technical-data.html')
})
export class TechnicalDataComponent {
    @Output() selectedStair: EventEmitter<string> = new EventEmitter<string>();

    getStair(stair) {
        this.selectedStair.emit(stair);
    }
}
