import {Component, Input, DoCheck, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'subtotal',
    template: require('./subtotal.html')
})
export class SubTotalComponent implements DoCheck {
  @Input() subTotals: Array<Object>;
  @Output() notifyDiscount: EventEmitter<number> = new EventEmitter<number>();
  unitPrice: string;
  cantDiscount: number;
  discountTotal: number = 0;

  changeDetected: boolean;
  oldTotalStair: number = -1;
  oldUnitPrice: string = "sarasa";
  oldCantDiscount: number = -1;

  constructor() {}

  ngDoCheck() {
    if (this.subTotals[0]["subTotalStair"] !== this.oldTotalStair) {
      this.changeDetected = true;
      this.oldTotalStair = this.subTotals[0]["subTotalStair"];
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
        this.discountTotal = (this.subTotals[0]["subTotalStair"] * this.cantDiscount) / 100 ;
        this.discountTotal = this.discountTotal * -1;
        this.notifyDiscount.emit(this.discountTotal);
      } else if (this.unitPrice == "eur") {
        this.discountTotal = this.cantDiscount;
        this.discountTotal = this.discountTotal * -1;
        this.notifyDiscount.emit(this.discountTotal);
      }
    }

    this.changeDetected = false;
  }
}
