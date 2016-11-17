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
  subTotalTransport: number = 0;
  subTotalExtras: number = 0;

  constructor (private communicateService: CommunicateService) {}

  onStair(message:string):void {
    this.stair = message;
    this.subTotalStair = 0;

    this.calculateTotal();
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

  totalTransport(message:number):void {
    this.subTotalTransport = 0;

    this.subTotalTransport = this.subTotalTransport + message;

    this.calculateTotal();
  }

  totalExtras(message:number):void {
    this.subTotalExtras = 0;

    this.subTotalExtras = this.subTotalExtras + message;

    this.calculateTotal();
  }

  calculateTotal() {
    this.total = 0;

    this.total = this.subTotalStair + this.subTotalService + this.subTotalTransport + this.subTotalExtras;
  }

  save() {
    this.communicateService.isSubmit(true);
    console.log('Se envio');
  }
}
