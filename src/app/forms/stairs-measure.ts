import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import {CommunicateService} from '../services/CommunicateService';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {formErrors} from '../constants';
declare var jquery: any;
declare var $ : any;

@Component({
    selector: 'stairs-measure',
    template: require('./stairs-measure.html')
})

/** Class stair of type measure */
export class StairsMeasureComponent implements OnInit {
  @Output() notifyModelId: EventEmitter<number> = new EventEmitter<number>();
  @Output() notifyTotal: EventEmitter<number> = new EventEmitter<number>();
  isSubmit: boolean = false;
  emptyField = formErrors.message_emptyField;

  populateModels: any;
  populateTreadName: any;
  populateStructure: any;
  populateAccessories: any;
  populateModelsRailing: any;
  populateModelsGuardrail: any;

  idApplyAccessories: any;

  subTotalStructures: number = 0;
  subTotalTreads: number = 0;
  subTotalRailing: number = 0;
  subTotalGuardrail: number = 0;
  subTotalAccessories: number = 0;
  totalStair: number = 0;

  private stairForm: FormGroup;

  /**
   * @constructor
   * @param populateService - service for populate the selects.
   * @param cs - service for communicate all the components.
   * @param _fb
   */
  constructor(private populateService: PopulateService, private cs: CommunicateService, private _fb: FormBuilder) {
    this.stairForm = this._fb.group({
      cant: [1, Validators.required],
      model: [0, Validators.required],
      structures: this._fb.array([
        this.initStructure(),
      ]),
      treads: this._fb.array([
        this.initTread(),
      ]),
      accessories: this._fb.array([
      ]),
      railing: this._fb.group({
        model: [{value: 0, disabled: true}, Validators.required],
        cantStraight: [0, Validators.required],
        priceStraight: [0],
        cantCurve: [0, Validators.required],
        priceCurve: [0],
        railing: [{value: 0, disabled: true}, Validators.required],
        finish: [{value: 0, disabled: true}, Validators.required]
      }),
      guardrail: this._fb.group({
        activeGuardrail: [false],
        model: [{value: 0, disabled: true}],
        cantStraight: [{value: 0, disabled: true}],
        priceStraight: [0],
        cantCurve: [{value: 0, disabled: true}],
        priceCurve: [0],
        railing: [{value: 0, disabled: true}],
        finish: [{value: 0, disabled: true}]
      })
    });
  }

  /**
   * Populate the stair model select, calculate the stair price when the form change and add all the values to a JSON
   */
  ngOnInit() {
    this.populateSelectModels();

    this.stairForm.valueChanges.subscribe(data => {
      this.calculateStructuresPrice(data);
      this.calculateTreadPrice(data);
      this.calculateRailingPrice(data);
      this.calculateGuardrailPrice(data);
      this.calculateAccessoriesPrice(data);
      this.cs.validateForm(this.stairForm.valid, 'stair');
      this.cs.addZoho(this.stairForm.value, 'stair');

      this.totalStair = (this.subTotalTreads + this.subTotalAccessories + this.subTotalRailing + this.subTotalGuardrail + this.subTotalStructures) * this.stairForm.controls['cant'].value;
      this.notifyTotal.emit(this.totalStair);
    });

    this.cs.submitted.subscribe(
      data => this.isSubmit = data
    );
  }

  /**
   * Get the data to populate the stair models
   */
  populateSelectModels() {
    this.populateService.getModels('measure').subscribe(data => this.populateModels = data);
  }

  loadDataModel(e: any) {
    let dataLoading = [{
      structures: false,
      treads: false,
      accessories: false,
      railing: false,
      guardrail: false
    }];

    $('#modalLoading').modal('show');

    this.notifyModelId.emit(this.stairForm.value['model']);

    this.populateService.getTreadName(e.target.value).subscribe(data => {
      this.populateTreadName = data;
      this.subTotalTreads = 0;

      this.enableInputs('treads', 'treadName');

      dataLoading[0]['treads'] = true;
      this.hideLoading(dataLoading);
    });

    this.populateService.getStructure(e.target.value).subscribe(data => {
      this.populateStructure = data;
      this.subTotalStructures = 0;

      this.enableInputs('structures', 'type');

      dataLoading[0]['structures'] = true;
      this.hideLoading(dataLoading);
    });

    this.populateService.getRailingModels(e.target.value).subscribe(data => {
      this.populateModelsRailing = data;
      this.subTotalRailing = 0;

      this.enableInputs('railing', 'model');

      dataLoading[0]['railing'] = true;
      this.hideLoading(dataLoading);
    });

    this.populateService.getGuardrailModels(e.target.value).subscribe(data => {
      this.populateModelsGuardrail = data;
      this.subTotalGuardrail = 0;

      this.enableInputs('guardrail', 'model');

      dataLoading[0]['guardrail'] = true;
      this.hideLoading(dataLoading);
    });

    this.populateService.getAccessories('measure', e.target.value).subscribe(data => {
      this.populateAccessories = data;
      this.subTotalAccessories = 0;

      this.enableInputs('accessories', 'accessorieName');

      dataLoading[0]['accessories'] = true;
      this.hideLoading(dataLoading);
    });
  }

  hideLoading(dataLoading: any) {
    if (dataLoading[0]['railing'] === true && dataLoading[0]['guardrail'] === true && dataLoading[0]['accessories'] === true && dataLoading[0]['structures'] === true && dataLoading[0]['treads'] === true) {
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
    if (controlName === 'railing' || controlName === 'guardrail') {
      this.stairForm.controls[controlName]['controls'][controlInput].enable();
    } else {
      for (let item of this.stairForm.controls[controlName]['controls']) {
        item.controls[controlInput].enable();
      }
    }
  }

  /**
   * @return {FormGroup} Structure form
   */
  initStructure() {
    return this._fb.group({
      cant: [1, Validators.required],
      type: [{value: 0, disabled: this.checkModelValue()}, Validators.required],
      finish: [{value: 0, disabled: true}, Validators.required],
      price: [0]
    });
  }

  /**
   * @return {FormGroup} Tread form
   */
  initTread() {
    return this._fb.group({
      id: [0],
      cant: [1, Validators.required],
      treadName: [{value: 0, disabled: this.checkModelValue()}, Validators.required],
      treadFinish: [{value: 0, disabled: true}, Validators.required],
      measure: [{value: 0, disabled: true}, Validators.required],
      price: [0]
    });
  }

  /**
   * @returns {FormGroup} Accessorie form
   */
  initAccessorie() {
    return this._fb.group({
      cant: [1, Validators.required],
      accessorieName: [{value: 0, disabled: this.checkModelValue()}, Validators.required],
      type: ['structures'],
      id: [0],
      unitPrice: [''],
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
      if (this.stairForm.value['model'] !== 0) {
        disableInput = false;
      }
    }

    return disableInput;
  }

  /**
   * Add a new form
   *
   * @param nameControl - the form type
   */
  addRow(nameControl: string) {
    const control = <FormArray>this.stairForm.controls[nameControl];

    if (nameControl === 'structures') {
      control.push(this.initStructure());
    } else if (nameControl === 'treads') {
      control.push(this.initTread());
    } else {
      control.push(this.initAccessorie());
    }
  }

  /**
   * Remove a form
   *
   * @param controlInput - The Child Input
   */
  removeRow(controlInput: any) {
    const control = <FormArray>this.stairForm.controls[controlInput.name];
    control.removeAt(controlInput.index);
  }

  /**
   * Remove an Accessorie form
   *
   * @param controlInput - The Child Input
   */
  removeAccessorieRow(index: number, name: string) {
    const control = <FormArray>this.stairForm.controls[name];
    control.removeAt(index);
  }

  /**
   * Calculate only the price of the structures
   *
   * @param data - Form values
   */
  calculateStructuresPrice(data: any) {
    this.subTotalStructures = 0;

    for (var itemStructure of data.structures) {
      // this.calculateAccessoriesPrice(data);
      this.subTotalStructures = this.subTotalStructures + itemStructure.price;
    }
  }

  /**
   * Calculate only the price of the treads
   *
   * @param data - Form values
   */
  calculateTreadPrice(data: any) {
    this.subTotalTreads = 0;

    for (var itemTread of data.treads) {
      // this.calculateAccessoriesPrice(data);
      this.subTotalTreads = this.subTotalTreads + itemTread.price;
    }
  }

  /**
   * Calculate only the price of the railing
   *
   * @param data - Form values
   */
  calculateRailingPrice(data: any) {
    this.subTotalRailing = 0;

    this.subTotalRailing = data.railing['priceStraight'] + data.railing['priceCurve'];
  }

  /**
   * Calculate only the price of the railing
   *
   * @param data - Form values
   */
  calculateGuardrailPrice(data: any) {
    this.subTotalGuardrail = 0;

    this.subTotalGuardrail = data.guardrail['priceStraight'] + data.guardrail['priceCurve'];
  }

  /**
   * Calculate only the price of the accessories
   *
   * @param data - Form values
   */
  calculateAccessoriesPrice(data: any) {
    this.subTotalAccessories = 0;
    let cont;

    if (typeof this.populateAccessories !== 'undefined') {
      for (let accessorie of this.populateAccessories) {
        cont = 0;

        for (let itemAccessorie of data.accessories) {
          if (itemAccessorie['type'] === 'railing' || itemAccessorie['type'] === 'guardrail') {
            if (itemAccessorie['unitPrice'] === 'eur') {
              if (accessorie.id === Number(itemAccessorie.accessorieName)) {
                this.stairForm.value.accessories[cont].price = itemAccessorie.cant * accessorie.Precio;
              }
            } else if (itemAccessorie['unitPrice'] === 'porc') {
              if (accessorie.id === Number(itemAccessorie.accessorieName)) {
                if (itemAccessorie['type'] === 'guardrail') {
                  this.stairForm.value.accessories[cont].price = ((this.subTotalGuardrail * accessorie.Porcentaje) / 100) * itemAccessorie.cant;
                } else {
                  this.stairForm.value.accessories[cont].price = ((this.subTotalRailing * accessorie.Porcentaje) / 100) * itemAccessorie.cant;
                }
              }
            }
          } else {
            if (itemAccessorie['unitPrice'] === 'eur' && itemAccessorie['id']) {
              if (accessorie.id === Number(itemAccessorie.accessorieName)) {
                this.stairForm.value.accessories[cont].price = itemAccessorie.cant * accessorie.Precio;
              }
            } else if (itemAccessorie['unitPrice'] === 'porc' && itemAccessorie['id']) {
              if (accessorie.id === Number(itemAccessorie.accessorieName)) {
                this.stairForm.value.accessories[cont].price = ((this.stairForm.controls[itemAccessorie['type']]['controls'][itemAccessorie['id']].value.price * accessorie.Porcentaje) / 100) * itemAccessorie.cant;
              }
            }
          }

          cont++;
        }
      }
    }

    for (let itemAccessorie of data.accessories) {
      this.subTotalAccessories = this.subTotalAccessories + itemAccessorie.price;
    }
  }

  /**
   * Enable the accessorie id select
   */
  checkApply(accessorie: any, idAccessorie: any): void {
    if (accessorie['controls']['type'].value === 'railing' || accessorie['controls']['type'].value === 'guardrail') {
      accessorie['controls']['unitPrice'].setValue(null);
      accessorie['controls']['id'].setValue(null);
    }
  }
}
