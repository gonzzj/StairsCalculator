import {Component} from '@angular/core';

@Component({
    selector: 'stairs-data',
    template: require('./stairs.html')
})

export class StairsComponent {
    stair: string;

    onStair(message:string):void {
        this.stair = message;
    }
}
