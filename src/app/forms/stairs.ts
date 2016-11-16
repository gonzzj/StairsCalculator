import {Component} from '@angular/core';
import {CommunicateService} from '../services/CommunicateService';

@Component({
    selector: 'stairs-data',
    template: require('./stairs.html')
})

export class StairsComponent {
  stair: string = "measure";
  total: number = 0;

  constructor (private communicateService: CommunicateService) {}

  onStair(message:string):void {
    this.stair = message;
  }

  totalStair(message:number):void {
    this.total = 0;

    this.total = this.total + message;
  }

  save() {
    this.communicateService.isSubmit(true);
    console.log('Se envio');
  }
}
