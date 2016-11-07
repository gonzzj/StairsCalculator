import {Component} from '@angular/core';
import {PopulateService} from '../services/PopulateService'

@Component({
    selector: 'stairs-measure',
    template: require('./stairs-measure.html')
})
export class StairsMeasureComponent {
  populateModels: any;
  populateTreadName: any;
  populateTreadFinish: any;
  populateMeasure: any;
  populateStructure: any;
  populateRiserFinish: any;

  constructor(private populateService: PopulateService) {
    this.populateService.getAllModels()
      .then(data => {
        this.populateModels = data;
      });

    this.populateService.getTreadName()
      .then(data => {
        this.populateTreadName = data;
      });

    this.populateService.getTreadFinish()
      .then(data => {
        this.populateTreadFinish = data;
      });

    this.populateService.getMeasure()
      .then(data => {
        this.populateMeasure = data;
      });

    this.populateService.getStructure()
      .then(data => {
        this.populateStructure = data;
      });

    this.populateService.getRiserFinish()
      .then(data => {
        this.populateRiserFinish = data;
      });
  }
}
