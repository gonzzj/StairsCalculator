import {Component} from '@angular/core';
import {CommunicateService} from '../services/CommunicateService';

@Component({
    selector: 'stairs-data',
    template: require('./stairs.html')
})

export class StairsComponent {
  stair: string = "measure";
  total: number = 0;
  subTotalStair: number = 0;
  subTotalService: number = 0;

  constructor (private communicateService: CommunicateService) {}

  onStair(message:string):void {
    this.stair = message;
  }

  totalStair(message:number):void {
    this.subTotalStair = 0;

    this.subTotalStair = this.subTotalStair + message;

    this.calculateTotal();
  }

  totalService(message:number):void {
    this.subTotalService = 0;

    this.subTotalService = this.subTotalService + message;

    this.calculateTotal();
  }

  save() {
    this.communicateService.isSubmit(true);
    console.log('Se envio');
  }

  calculateTotal() {
    this.total = 0;

    this.total = this.subTotalStair + this.subTotalService;
  }
}
