import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {CommunicateService} from '../services/CommunicateService';
import {formErrors} from '../constants';

@Component({
    selector: 'stairs-kit',
    template: require('./stairs-kit.html')
})

/** Class stair of type kit */
export class StairsKitComponent implements OnInit {
  populateModels: any;
  populateAccessories: any;

  private stairForm: FormGroup;

  subTotalAccessories: number = 0;
  totalStair: number = 0;

  @Output() notifyTotal: EventEmitter<number> = new EventEmitter<number>();
  isSubmit: boolean = false;
  emptyField = formErrors.message_emptyField;

  /**
   * @constructor
   * @param populateService - service for populate the selects.
   * @param _fb
   * @param cs - service for communicate all the components.
   */
  constructor(private populateService: PopulateService, private _fb: FormBuilder, private cs: CommunicateService) {
    this.stairForm = this._fb.group({
      model: ['', Validators.required],
      diameter: ['', Validators.required],
      measure: ['', Validators.required],
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
      this.calculateAccessoriesPrice(data);
      this.totalStair = this.subTotalAccessories + this.calculateModelPrice(data);
      this.notifyTotal.emit(this.totalStair);
      this.cs.validateForm(this.stairForm.valid, "stair");
      this.cs.addZoho(this.stairForm.value, "stair");
    });

    this.cs.submitted.subscribe(
      data => this.isSubmit = data
    );
  }

  /**
   * @return {FormGroup} An accessorie form
   */
  initAccessorie() {
    return this._fb.group({
      cant: [1],
      accessorieName: ['', Validators.required],
      price: [0]
    });
  }

  /**
   * Add a new accessorie form
   */
  addRow() {
    const control = <FormArray>this.stairForm.controls['accessories'];
    control.push(this.initAccessorie());
  }

  /**
   * Remove an accessorie form
   *
   * @param i - id row form
   */
  removeRow(i: number) {
    const control = <FormArray>this.stairForm.controls['accessories'];
    control.removeAt(i);
  }

  /**
   * Calculate only the price of the model
   *
   * @param data - the form values
   * @returns {number}
   */
  calculateModelPrice(data) {
    var priceModel = 0;

    for (var model of this.populateModels) {
      if (model.name == data.model) {
        priceModel = model.price;
      }
    }

    return priceModel;
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

    this.populateService.getAccessories()
      .then(data => {
        this.populateAccessories = data;
      });
  }
}
