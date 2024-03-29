import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {CommunicateService} from '../services/CommunicateService';
import {formErrors} from '../constants';
declare var jquery: any;
declare var $ : any;

@Component({
    selector: 'stairs-esc',
    template: require('./stairs-esc.html')
})

/** Class stair of type esc */
export class StairsEscComponent implements OnInit {
  @Output() notifyModelId: EventEmitter<number> = new EventEmitter<number>();
  @Output() notifyTotal: EventEmitter<number> = new EventEmitter<number>();
  populateModels: any;
  populateEscMeasures: any;
  populateAccessories: any;
  subTotalAccessories: number = 0;
  totalStair: number = 0;
  isSubmit: boolean = false;
  emptyField = formErrors.message_emptyField;
  private stairForm: FormGroup;

  /**
   * @constructor
   * @param populateService - service for populate the selects.
   * @param _fb
   * @param cs - service for communicate all the components.
   */
  constructor(private populateService: PopulateService, private _fb: FormBuilder, private cs: CommunicateService) {
    this.stairForm = this._fb.group({
      model: [0, Validators.required],
      measure: [{value: 0, disabled: true}, Validators.required],
      accessories: this._fb.array([
      ])
    });
  }

  /**
   * Populate the selects, calculate the stair price when the form change and add the values to a JSON
   */
  ngOnInit() {
    this.populateSelectModels();

    this.stairForm.valueChanges.subscribe(data => {
      this.calculateAccessoriesPrice(data);
      this.totalStair = this.subTotalAccessories + this.calculateModelPrice(data);
      this.notifyTotal.emit(this.totalStair);
      this.cs.validateForm(this.stairForm.valid, 'stair');
      this.cs.addZoho(this.stairForm.value, 'stair');
    });

    this.cs.submitted.subscribe(
      data => this.isSubmit = data
    );
  }

  /**
   * Get the data to populate the selects
   */
  populateSelectModels() {
    this.populateService.getModels('esc').subscribe(data => this.populateModels = data);
  }

  loadDataModel(e: any) {
    let dataLoading = [{
      accessories: false
    }];

    $('#modalLoading').modal('show');

    this.notifyModelId.emit(this.stairForm.value['model']);

    this.populateService.getEscMeasures(e.target.value).subscribe(data => {
      this.populateEscMeasures = data;

      this.stairForm.controls['measure'].enable();
    });

    this.populateService.getAccessories('esc', e.target.value).subscribe(data => {
      this.populateAccessories = data;
      this.subTotalAccessories = 0;

      this.enableInputs('accessories', 'accessorieName');

      dataLoading[0]['accessories'] = true;
      this.hideLoading(dataLoading);
    });
  }

  hideLoading(dataLoading: any) {
    if (dataLoading[0]['accessories'] === true) {
      $('#modalLoading').modal('hide');
    }
  }

  /**
   * Enable all the first inputs
   * 
   * @param controlName - Control row
   * @param controlInput - Input field
   */
  enableInputs(controlName: string, controlInput: string) {
    if (controlName === 'diameter' || controlName === 'measure') {
      this.stairForm.controls[controlName].enable();
    } else {
      for (let item of this.stairForm.controls[controlName]['controls']) {
        item.controls[controlInput].enable();
      }
    }
  }

  /**
   * @return {FormGroup} An accessorie form
   */
  initAccessorie() {
    return this._fb.group({
      cant: [1],
      accessorieName: [{value: 0, disabled: this.checkModelValue()}, Validators.required],
      price: [0]
    });
  }

  /**
   * Check if the model has a value
   * 
   * @returns {boolean} disableInput
   */
  checkModelValue() {
    let disableInput : boolean = true;

    if (typeof this.stairForm !== 'undefined') {
      if (this.stairForm.value['model'] !== '') {
        disableInput = false;
      }
    }

    return disableInput;
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
  calculateModelPrice(data: any) {
    var priceModel = 0;

    if (typeof data.measure !== 'undefined') {
      for (let measure of this.populateEscMeasures) {
        if (measure.id === Number(data.measure)) {
          priceModel = measure.Precio;
        }
      }
    }

    return priceModel;
  }

  /**
   * Calculate only the price of the accessories
   *
   * @param data - the form values
   */
  calculateAccessoriesPrice(data: any) {
    this.subTotalAccessories = 0;
    let cont;

    if (typeof this.populateAccessories !== 'undefined') {

      for (let accessorie of this.populateAccessories) {
        cont = 0;
        for (let itemAccessorie of data.accessories) {
          if (accessorie.id === Number(itemAccessorie.accessorieName)) {
            this.stairForm.value.accessories[cont].price = itemAccessorie.cant * accessorie.Precio;
          }
          cont++;
        }
      }

      for (let itemAccessorie of data.accessories) {
        this.subTotalAccessories = this.subTotalAccessories + itemAccessorie.price;
      }

    }
  }
}
