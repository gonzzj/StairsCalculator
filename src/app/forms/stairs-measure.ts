import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import {CommunicateService} from '../services/CommunicateService';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'stairs-measure',
    template: require('./stairs-measure.html')
})

/** Class stair of type measure */
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
  isSubmit: boolean = false;

  /**
   * @constructor
   * @param populateService - service for populate the selects.
   * @param cs - service for communicate all the components.
   * @param _fb
   */
  constructor(private populateService: PopulateService, private cs: CommunicateService, private _fb: FormBuilder) {
    this.stairForm = this._fb.group({
      model: [''],
      structure: [''],
      treads: this._fb.array([
        this.initTread(),
      ]),
      accessories: this._fb.array([
      ])
    });
  }

  /**
   * Populate the selects, calculate the stair price when the form change and add the values to a JSON
   */
  ngOnInit() {
    this.populateSelects();

    this.stairForm.valueChanges.subscribe(data => {
      this.calculateTreadPrice(data);
      this.calculateAccessoriesPrice(data);
      this.totalStair = this.subTotalTreads + this.subTotalAccessories + this.calculateModelStructurePrice(data);
      this.notifyTotal.emit(this.totalStair);
      this.cs.addZoho(this.stairForm.value, "stair");
    });

    this.cs.submitted.subscribe(
      data => this.isSubmit = data
    );
  }

  /**
   * @return {FormGroup} A tread form
   */
  initTread() {
    return this._fb.group({
      cant: [1],
      treadName: [''],
      measure: [''],
      treadFinish: [''],
      price: [0]
    });
  }

  /**
   * @returns {FormGroup} An accessorie form
   */
  initAccessorie() {
    return this._fb.group({
      cant: [1],
      accessorieName: [''],
      price: [0]
    });
  }

  /**
   * Add a new tread or accessorie form
   *
   * @param nameControl - the form type
   */
  addRow(nameControl: string) {
    const control = <FormArray>this.stairForm.controls[nameControl];

    if (nameControl == "treads") {
      control.push(this.initTread());
    } else {
      control.push(this.initAccessorie());
    }
  }

  /**
   * Remove a tread or accessorie form
   *
   * @param i - id row form
   * @param nameControl - the form type
   */
  removeRow(i: number, nameControl: string) {
    const control = <FormArray>this.stairForm.controls[nameControl];
    control.removeAt(i);
  }

  /**
   * Calculate only the price of the model and the structure
   *
   * @param data - the form values
   * @returns {number}
   */
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

  /**
   * Calculate only the price of the treads
   *
   * @param data - the form values
   */
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

  /**
   * Calculate only the price of the accessories
   *
   * @param data - the form values
   */
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

  /**
   * Get the data to populate the selects
   */
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
