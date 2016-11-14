import {Component} from '@angular/core';
import {Observable} from "rxjs";

@Component({
    selector: 'stairs-data',
    template: require('./stairs.html')
})

export class StairsComponent {
  stair: string = "measure";

  onStair(message:string):void {
    this.stair = message;
  }
}
