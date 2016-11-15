import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';

@Component({
    selector: 'stairs-measure',
    template: require('./stairs-measure.html')
})
export class StairsMeasureComponent implements OnInit {
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
  totalStair: number = 0;

  @Output() notifyTotal: EventEmitter<number> = new EventEmitter<number>();

  constructor(private populateService: PopulateService, private _fb: FormBuilder) {
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
  }

  ngOnInit() {
    this.populateSelects();

    this.stairForm.valueChanges.subscribe(data => {
      this.calculateTreadPrice(data);
      this.calculateAccessoriesPrice(data);
      this.totalStair = this.subTotalTreads + this.subTotalAccessories + this.calculateModelStructurePrice(data);
      this.notifyTotal.emit(this.totalStair);
    });
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

  initAccessorie() {
    return this._fb.group({
      cant: [1],
      accessorieName: [''],
      price: [0]
    });
  }

  addRow(nameControl: string) {
    const control = <FormArray>this.stairForm.controls[nameControl];

    if (nameControl == "treads") {
      control.push(this.initTread());
    } else {
      control.push(this.initAccessorie());
    }
  }

  removeRow(i: number, nameControl: string) {
    const control = <FormArray>this.stairForm.controls[nameControl];
    control.removeAt(i);
  }

  calculateModelStructurePrice(data) {
    var priceModel = 0;
    var priceStructure = 0;

    for (var model of this.populateModels) {
      if (model.name == data.model) {
        priceModel = model.price;
      }
    }

    for (var structure of this.populateStructure) {
      if (structure.name == data.structure) {
        priceStructure = structure.price;
      }
    }

    return priceModel + priceStructure;
  }

  calculateTreadPrice(data) {
    this.subTotalTreads = 0;
    var cont;

    for (var tread of this.populateTreadName) {
      cont = 0;
      for (var itemTread of data.treads) {
        if (tread.name == itemTread.treadName) {
          this.stairForm.value.treads[cont].price = itemTread.cant * tread.price;
        }
        cont++;
      }
    }

    for (var itemTread of data.treads) {
      this.subTotalTreads = this.subTotalTreads + itemTread.price;
    }
  }

  calculateAccessoriesPrice(data) {
    this.subTotalAccessories = 0;
    var cont;

    for (var accessorie of this.populateAccessories) {
      cont = 0;
      for (var itemAccessorie of data.accessories) {
        if (accessorie.name == itemAccessorie.accessorieName) {
          this.stairForm.value.accessories[cont].price = itemAccessorie.cant * accessorie.price;
        }
        cont++;
      }
    }

    for (var itemAccessorie of data.accessories) {
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
