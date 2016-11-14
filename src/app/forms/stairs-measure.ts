import {Component, Input} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';

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
  populateAccessories: any;

  private stairForm: FormGroup;

  subTotalTreads: number = 0;
  subTotalAccessories: number = 0;

  constructor(private populateService: PopulateService, private _fb: FormBuilder) {
    this.populateSelects();

    this.stairForm = this._fb.group({
      model: [''],
      structure: [''],
      treads: this._fb.array([
        this.initTread(),
      ]),
      accessories: this._fb.array([
        this.initAccessorie(),
      ])
    });

    this.stairForm.valueChanges.subscribe(data => this.calculateTreadPrice());
    this.stairForm.valueChanges.subscribe(data => this.calculateAccessoriesPrice());
  }

  initTread() {
    return this._fb.group({
      cant: [1],
      treadName: [''],
      measure: [''],
      treadFinish: [''],
      price: [0]
    });
  }

  addTread() {
    const control = <FormArray>this.stairForm.controls['treads'];
    control.push(this.initTread());
  }

  removeTread(i: number) {
    const control = <FormArray>this.stairForm.controls['treads'];
    control.removeAt(i);
  }

  calculateTreadPrice() {
    this.subTotalTreads = 0;
    var cont;

    for (var tread of this.populateTreadName) {
      cont = 0;
      for (var itemTread of this.stairForm.value.treads) {
        if (tread.name == itemTread.treadName) {
          this.stairForm.value.treads[cont].price = itemTread.cant * tread.price;
        }
        cont++;
      }
    }

    for (var itemTread of this.stairForm.value.treads) {
      this.subTotalTreads = this.subTotalTreads + itemTread.price;
    }
  }

  initAccessorie() {
    return this._fb.group({
      cant: [1],
      accessorieName: [''],
      price: [0]
    });
  }

  addAccessorie() {
    const control = <FormArray>this.stairForm.controls['accessories'];
    control.push(this.initAccessorie());
  }

  removeAccessorie(e: number) {
    const control = <FormArray>this.stairForm.controls['accessories'];
    control.removeAt(e);
  }

  calculateAccessoriesPrice() {
    this.subTotalAccessories = 0;
    var cont;

    for (var accessorie of this.populateAccessories) {
      cont = 0;
      for (var itemAccessorie of this.stairForm.value.accessories) {
        if (accessorie.name == itemAccessorie.accessorieName) {
          this.stairForm.value.accessories[cont].price = itemAccessorie.cant * accessorie.price;
        }
        cont++;
      }
    }

    for (var itemAccessorie of this.stairForm.value.accessories) {
      this.subTotalAccessories = this.subTotalAccessories + itemAccessorie.price;
    }
  }

  populateSelects() {
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

    this.populateService.getAccessories()
      .then(data => {
        this.populateAccessories = data;
      });
  }
}
