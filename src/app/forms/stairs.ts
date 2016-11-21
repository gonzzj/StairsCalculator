import {Component} from '@angular/core';
import {CommunicateService} from '../services/CommunicateService';

@Component({
    selector: 'stairs-data',
    template: require('./stairs.html')
})

export class StairsComponent {
  stair: string = "measure";
  total: number = 0;
  subTotals:Array<Object>;

  constructor (private communicateService: CommunicateService) {
    this.subTotals = [
      {
        subTotalStair: 0,
        subTotalService: 0,
        subTotalTransport: 0,
        subTotalExtras: 0,
        subTotalDiscount: 0
      }
    ];
  }

  onStair(message:string):void {
    this.stair = message;
    this.subTotals[0]["subTotalStair"] = 0;

    this.calculateTotal();
  }

  totalStair(message:number):void {
    this.subTotals[0]["subTotalStair"] = 0;

    this.subTotals[0]["subTotalStair"] = this.subTotals[0]["subTotalStair"] + message;

    this.calculateTotal();
  }

  totalService(message:number):void {
    this.subTotals[0]["subTotalService"] = 0;

    this.subTotals[0]["subTotalService"] = this.subTotals[0]["subTotalService"] + message;

    this.calculateTotal();
  }

  totalTransport(message:number):void {
    this.subTotals[0]["subTotalTransport"] = 0;

    this.subTotals[0]["subTotalTransport"] = this.subTotals[0]["subTotalTransport"] + message;

    this.calculateTotal();
  }

  totalExtras(message:Array<Object>):void {
    /*this.subTotals = [{subTotalStair: 0, subTotalService: 0, subTotalTransport: 0, subTotalExtras: 0, subTotalDiscount: 0}];

    this.subTotals[0]["subTotalExtras"] = this.subTotals[0]["subTotalExtras"] + message[0]["extraExtras"];

    this.subTotals[0]["subTotalTransport"] = this.subTotals[0]["subTotalTransport"] + message[0]["extraTransport"];

    this.subTotals[0]["subTotalService"] = this.subTotals[0]["subTotalService"] + message[0]["extraService"];

    this.subTotals[0]["subTotalStair"] = this.subTotals[0]["subTotalStair"] + message[0]["extraStair"];

    this.calculateTotal();*/
  }

  totalDiscount(message:number):void {
    this.subTotals[0]["subTotalDiscount"] = 0;

    this.subTotals[0]["subTotalDiscount"] = message;

    this.calculateTotal();
  }

  calculateTotal() {
    this.total = 0;

    this.total = this.subTotals[0]["subTotalStair"] + this.subTotals[0]["subTotalService"] + this.subTotals[0]["subTotalTransport"] + this.subTotals[0]["subTotalExtras"] + this.subTotals[0]["subTotalDiscount"];
  }

  save() {
    this.communicateService.isSubmit(true);
    console.log('Se envio');
  }
}
