import {Component} from '@angular/core';
import {CommunicateService} from '../services/CommunicateService';

@Component({
    selector: 'stairs-data',
    template: require('./stairs.html')
})

/** Class father component stairs */
export class StairsComponent {
  stairData: Array<Object>;
  stairCant: number = 1;
  stair: string = 'measure';
  total: number = 0;
  subTotals: Array<Object>;
  extras: Array<Object>;
  subTotalsAndExtras: Array<Object>;

  /**
   * @constructor
   * @param cs - service for communicate all the components.
   */
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

  /**
   * Change the different type of stair components and reset the subtotal stair
   *
   * @param message - the chosen stair
   */
  onStair(message: string): void {
    this.stair = message;
    this.stairCant = 1;
    this.subTotals[0]['subTotalStair'] = 0;

    this.calculateTotal();
  }

  /**
   * Set the id model and stair type and send it to child components
   * 
   * @param message - the Model Id
   */
  setStair(message: number): void {
    this.stairData = [
      {
        stairType: this.stair,
        stairModelId: message
      }
    ];
  }

  /**
   * Set the cant model
   * 
   * @param message - the Model Id
   */
  setStairCant(message: number): void {
    this.stairCant = message;
  }

  /**
   * With the stair price, calculate the total
   *
   * @param message - the subtotal of the stair
   */
  totalStair(message: number): void {
    this.subTotals[0]['subTotalStair'] = 0;

    this.subTotals[0]['subTotalStair'] = this.subTotals[0]['subTotalStair'] + message;

    this.calculateTotal();
  }

  /**
   * With the service price, calculate the total
   *
   * @param message - the subtotal of the services
   */
  totalService(message: number): void {
    this.subTotals[0]['subTotalService'] = 0;

    this.subTotals[0]['subTotalService'] = this.subTotals[0]['subTotalService'] + message;

    this.calculateTotal();
  }

  /**
   * With the transport price, calculate the total
   *
   * @param message - the subtotal of the transport
   */
  totalTransport(message: number): void {
    this.subTotals[0]['subTotalTransport'] = 0;

    this.subTotals[0]['subTotalTransport'] = this.subTotals[0]['subTotalTransport'] + message;

    this.calculateTotal();
  }

  /**
   * With the extras prices, calculate the total
   *
   * @param message - the subtotal of the extras
   */
  totalExtras(message: Array<Object>): void {
    this.extras = [{extras: 0, transport: 0, service: 0, stair: 0}];

    this.extras[0]['extras'] = message[0]['extraExtras'];

    this.extras[0]['transport'] = message[0]['extraTransport'];

    this.extras[0]['service'] = message[0]['extraService'];

    this.extras[0]['stair'] = message[0]['extraStair'];

    this.calculateTotal();
  }

  /**
   * With the discount, calculate the total
   *
   * @param message - the value of the discount
   */
  totalDiscount(message: number): void {
    this.subTotals[0]['subTotalDiscount'] = 0;

    this.subTotals[0]['subTotalDiscount'] = message;

    this.calculateTotal();
  }

  /**
   * Add the extras prices and calculate the total
   */
  calculateTotal() {
    this.total = 0;

    this.addExtras();

    this.total = this.subTotalsAndExtras[0]['stair'] + this.subTotalsAndExtras[0]['service'] + this.subTotalsAndExtras[0]['transport'] + this.subTotalsAndExtras[0]['extras'] + this.subTotals[0]['subTotalDiscount'];
  }

  /**
   * Add the extras prices to each subtotal
   */
  addExtras() {
    this.subTotalsAndExtras = [{extras: 0, transport: 0, service: 0, stair: 0}];

    this.subTotalsAndExtras[0]['extras'] =  this.subTotals[0]['subTotalExtras'] + this.extras[0]['extras'];

    this.subTotalsAndExtras[0]['transport'] = (this.subTotals[0]['subTotalTransport'] * this.stairCant) + this.extras[0]['transport'];

    this.subTotalsAndExtras[0]['service'] = (this.subTotals[0]['subTotalService'] * this.stairCant) + this.extras[0]['service'];

    this.subTotalsAndExtras[0]['stair'] = this.subTotals[0]['subTotalStair'] + this.extras[0]['stair'];

    this.cs.addZoho(this.subTotalsAndExtras, 'subTotal');
  }

  /**
   * Open a PDF with all the information of the form
   */
  printPDF() {
    this.cs.isSubmit(true);

    this.cs.savePDF(this.stair);
  }

  /**
   * Send to zoho a JSON form and check when the button is clicked
   */
  save() {
    this.cs.isSubmit(true);

    this.cs.sendZoho(this.stair);

    window.scrollTo(0, 0);
  }
}
