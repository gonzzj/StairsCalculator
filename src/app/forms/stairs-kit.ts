import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {CommunicateService} from '../services/CommunicateService';
import {formErrors} from '../constants';
import {CompleterService, CompleterData} from 'ng2-completer';

@Component({
    selector: 'stairs-kit',
    template: require('./stairs-kit.html')
})

/** Class stair of type kit */
export class StairsKitComponent implements OnInit {
  populateModels: any;
  populateKitDiameters: any;
  populateKitMeasure: any;
  populateAccessories: any;

  private stairForm: FormGroup;

  subTotalAccessories: number = 0;
  totalStair: number = 0;

  @Output() notifyModelId: EventEmitter<number> = new EventEmitter<number>();
  @Output() notifyTotal: EventEmitter<number> = new EventEmitter<number>();
  isSubmit: boolean = false;
  emptyField = formErrors.message_emptyField;

  /**
   * @constructor
   * @param populateService - service for populate the selects.
   * @param _fb
   * @param cs - service for communicate all the components.
   * @param completerService - autocomplete
   */
  constructor(private populateService: PopulateService, private _fb: FormBuilder, private cs: CommunicateService, private completerService: CompleterService) {
    this.stairForm = this._fb.group({
      idModel: [0],
      model: ['', Validators.required],
      diameter: [{value: '', disabled: true}, Validators.required],
      measure: [{value: '', disabled: true}, Validators.required],
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
      this.cs.validateForm(this.stairForm.valid, "stair");
      this.cs.addZoho(this.stairForm.value, "stair");
    });

    this.cs.submitted.subscribe(
      data => this.isSubmit = data
    );
  }

  /**
   * Get the data to populate the selects
   */
  populateSelectModels() {
    this.populateService.getModels('kit').subscribe(data => this.populateModels = data);
  }

  loadDataModel(e) { 
    this.notifyModelId.emit(this.stairForm.value['model']);
    this.stairForm.controls['measure'].disable();

    this.populateService.getKitDiameters(e.target.value).subscribe(data => {
      this.populateKitDiameters = data;

      this.enableInputs('diameter', '');
    });

    this.populateService.getAccessories('kit', e.target.value).subscribe(data => {
      this.populateAccessories = data;
      this.subTotalAccessories = 0;

      this.enableInputs('accessories', 'accessorieName');
    });
  }

  loadKitMeasure(e) {
    this.populateService.getKitDiameterMeasures(e.target.value).subscribe(data => {
      this.populateKitMeasure = data;

      this.enableInputs('measure', '');
    });
  }

  /**
   * Enable all the first inputs
   * 
   * @param controlName - Control row
   * @param controlInput - Input field
   */
  enableInputs(controlName: string, controlInput: string) {
    if (controlName == 'diameter' || controlName == 'measure') {
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
      accessorieName: [{value: '', disabled: this.checkModelValue()}, Validators.required],
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
  calculateModelPrice(data) {
    let priceModel = 0;

    if (typeof data.measure !== 'undefined') {
      for (let measure of this.populateKitMeasure) {
        if (measure.id == Number(data.measure)) {
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
  calculateAccessoriesPrice(data) {
    this.subTotalAccessories = 0;
    var cont;

    if (typeof this.populateAccessories !== 'undefined') {

      for (var accessorie of this.populateAccessories) {
        cont = 0;
        for (var itemAccessorie of data.accessories) {
          if (accessorie.id == Number(itemAccessorie.accessorieName)) {
            this.stairForm.value.accessories[cont].price = itemAccessorie.cant * accessorie.Precio;
          }
          cont++;
        }
      }

      for (var itemAccessorie of data.accessories) {
        this.subTotalAccessories = this.subTotalAccessories + itemAccessorie.price;
      }

    }
  }
}
