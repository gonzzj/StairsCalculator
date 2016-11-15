import {Component, EventEmitter} from '@angular/core';

@Component({
    selector: 'stairs-data',
    template: require('./stairs.html')
})

export class StairsComponent {
  stair: string = "measure";
  total: number = 0;

  onStair(message:string):void {
    this.stair = message;
  }

  totalStair(message:number):void {
    this.total = 0;

    this.total = this.total + message;
  }

  save() {
    console.log('Se envio');
  }
}
