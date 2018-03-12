import {Component, Input, OnChanges} from '@angular/core';
import {CommunicateService} from '../services/CommunicateService';

@Component({
    selector: 'total',
    template: require('./total.html')
})
export class TotalComponent implements OnChanges {
  @Input() total: number;

  /**
   * @constructor
   * @param cs - service for communicate all the components.
   */
  constructor(private cs: CommunicateService) {}

  /**
   * Add the value to a JSON, if the total value changes
   */
  ngOnChanges() {
    this.cs.addZoho(this.total, "total");
  }
}
