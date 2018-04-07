import {Component, Input, DoCheck, Output, EventEmitter} from '@angular/core';
import {CommunicateService} from '../services/CommunicateService';

@Component({
    selector: 'subtotal',
    template: require('./subtotal.html')
})
export class SubTotalComponent implements DoCheck {
  @Input() subTotalsAndExtras: Array<Object>;
  @Output() notifyDiscount: EventEmitter<number> = new EventEmitter<number>();
  unitPrice: string = 'porc';
  cantDiscount: number = 0;
  discountTotal: number = 0;

  changeDetected: boolean;
  oldTotalStair: number = -1;
  oldUnitPrice: string = '';
  oldCantDiscount: number = -1;

  /**
   * @constructor
   * @param cs - service for communicate all the components.
   */
  constructor(private cs: CommunicateService) {}

  /**
   * Check if the discount changes and calculate it with the total
   */
  ngDoCheck() {
    if (this.subTotalsAndExtras[0]['stair'] !== this.oldTotalStair) {
      this.changeDetected = true;
      this.oldTotalStair = this.subTotalsAndExtras[0]['stair'];
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
      if (this.unitPrice === 'porc') {
        this.discountTotal = (this.subTotalsAndExtras[0]['stair'] * this.cantDiscount) / 100;
        this.discountTotal = this.discountTotal * -1;
        this.notifyDiscount.emit(this.discountTotal);
        this.cs.addZoho([{discount: this.cantDiscount + '%', value: this.discountTotal}], 'discount');
      } else if (this.unitPrice === 'eur') {
        this.discountTotal = this.cantDiscount;
        this.discountTotal = this.discountTotal * -1;
        this.notifyDiscount.emit(this.discountTotal);
        this.cs.addZoho([{discount: this.cantDiscount + ' €', value: this.discountTotal}], 'discount');
      }
    }

    this.changeDetected = false;
  }
}
