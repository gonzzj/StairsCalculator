import {Component, Input, DoCheck, Output, EventEmitter} from '@angular/core';
import {CommunicateService} from "../services/CommunicateService";

@Component({
    selector: 'subtotal',
    template: require('./subtotal.html')
})
export class SubTotalComponent implements DoCheck {
  @Input() subTotalsAndExtras: Array<Object>;
  @Output() notifyDiscount: EventEmitter<number> = new EventEmitter<number>();
  unitPrice: string;
  cantDiscount: number;
  discountTotal: number = 0;

  changeDetected: boolean;
  oldTotalStair: number = -1;
  oldUnitPrice: string = "sarasa";
  oldCantDiscount: number = -1;

  constructor(private cs: CommunicateService) {}

  ngDoCheck() {
    if (this.subTotalsAndExtras[0]["stair"] !== this.oldTotalStair) {
      this.changeDetected = true;
      this.oldTotalStair = this.subTotalsAndExtras[0]["stair"];
    }

    if (this.cantDiscount !== this.oldCantDiscount) {
      this.changeDetected = true;
      this.oldCantDiscount = this.cantDiscount;
    }

    if (this.unitPrice !== this.oldUnitPrice) {
      this.changeDetected = true;
      this.oldUnitPrice = this.unitPrice;
    }

    if (this.changeDetected) {
      if (this.unitPrice == "porc") {
        this.discountTotal = (this.subTotalsAndExtras[0]["stair"] * this.cantDiscount) / 100 ;
        this.discountTotal = this.discountTotal * -1;
        this.notifyDiscount.emit(this.discountTotal);
        this.cs.addZoho(this.discountTotal, "discount");
      } else if (this.unitPrice == "eur") {
        this.discountTotal = this.cantDiscount;
        this.discountTotal = this.discountTotal * -1;
        this.notifyDiscount.emit(this.discountTotal);
        this.cs.addZoho(this.discountTotal, "discount");
      }
    }

    this.changeDetected = false;
  }
}
