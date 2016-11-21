import {Component, Input, OnChanges} from '@angular/core';
import {CommunicateService} from "../services/CommunicateService";

@Component({
    selector: 'total',
    template: require('./total.html')
})
export class TotalComponent implements OnChanges {
  @Input() total: number;

  constructor(private cs: CommunicateService) {}

  ngOnChanges() {
    this.cs.addZoho(this.total, "total");
  }
}
