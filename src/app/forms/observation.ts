import {Component, OnChanges, DoCheck} from '@angular/core';
import {CommunicateService} from "../services/CommunicateService";

@Component({
    selector: 'observation',
    template: require('./observation.html')
})
export class ObservationComponent implements DoCheck {
  observations: string;

  constructor(private cs: CommunicateService) {}

  ngDoCheck() {
    this.cs.addZoho(this.observations, "observations");
  }
}
