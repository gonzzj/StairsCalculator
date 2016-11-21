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
  extras:Array<Object>;
  subTotalsAndExtras:Array<Object>;

  constructor (private cs: CommunicateService) {
    this.subTotals = [
      {
        subTotalStair: 0,
        subTotalService: 0,
        subTotalTransport: 0,
        subTotalExtras: 0,
        subTotalDiscount: 0
      }
    ];

    this.extras = [
      {
        extras: 0,
        transport: 0,
        service: 0,
        stair: 0
      }
    ];

    this.subTotalsAndExtras = [
      {
        extras: 0,
        transport: 0,
        service: 0,
        stair: 0
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
    this.extras = [{extras: 0, transport: 0, service: 0, stair: 0}];

    this.extras[0]["extras"] = message[0]["extraExtras"];

    this.extras[0]["transport"] = message[0]["extraTransport"];

    this.extras[0]["service"] = message[0]["extraService"];

    this.extras[0]["stair"] = message[0]["extraStair"];

    this.calculateTotal();
  }

  totalDiscount(message:number):void {
    this.subTotals[0]["subTotalDiscount"] = 0;

    this.subTotals[0]["subTotalDiscount"] = message;

    this.calculateTotal();
  }

  calculateTotal() {
    this.total = 0;

    this.addExtras();

    this.total = this.subTotalsAndExtras[0]["stair"] + this.subTotalsAndExtras[0]["service"] + this.subTotalsAndExtras[0]["transport"] + this.subTotalsAndExtras[0]["extras"] + this.subTotals[0]["subTotalDiscount"];
  }

  addExtras() {
    this.subTotalsAndExtras = [{extras: 0, transport: 0, service: 0, stair: 0}];

    this.subTotalsAndExtras[0]["extras"] =  this.subTotals[0]["subTotalExtras"] + this.extras[0]["extras"];

    this.subTotalsAndExtras[0]["transport"] = this.subTotals[0]["subTotalTransport"] + this.extras[0]["transport"];

    this.subTotalsAndExtras[0]["service"] = this.subTotals[0]["subTotalService"] + this.extras[0]["service"];

    this.subTotalsAndExtras[0]["stair"] = this.subTotals[0]["subTotalStair"] + this.extras[0]["stair"];

    this.cs.addZoho(this.subTotalsAndExtras, "subTotal");
  }

  save() {
    this.cs.isSubmit(true);

    this.cs.sendZoho();
    console.log('Se envio');
  }
}
