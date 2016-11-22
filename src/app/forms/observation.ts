import {Component, OnChanges, DoCheck} from '@angular/core';
import {CommunicateService} from "../services/CommunicateService";

@Component({
    selector: 'observation',
    template: require('./observation.html')
})
export class ObservationComponent implements DoCheck {
  observations: string;

  /**
   * @constructor
   * @param cs - service for communicate all the components.
   */
  constructor(private cs: CommunicateService) {}

  /**
   * Add the value to a JSON if the form changes
   */
  ngDoCheck() {
    this.cs.addZoho(this.observations, "observations");
  }
}
