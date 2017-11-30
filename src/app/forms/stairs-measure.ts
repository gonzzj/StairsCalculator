import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import {CommunicateService} from '../services/CommunicateService';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {formErrors} from '../constants';
import {CompleterService} from 'ng2-completer';
import { DISABLED } from '@angular/forms/src/model';

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
  populateModelsRailing: any;

  private stairForm: FormGroup;

  idApplyAccessories: any;

  subTotalStructures: number = 0;
  subTotalTreads: number = 0;
  subTotalRailing: number = 0;
  subTotalRailingStraight: number = 0;
  subTotalRailingCurve: number = 0;
  subTotalGuardrail: number = 0;
  subTotalGuardrailStraight: number = 0;
  subTotalGuardrailCurve: number = 0;
  subTotalAccessories: number = 0;
  totalStair: number = 0;

  @Output() notifyTotal: EventEmitter<number> = new EventEmitter<number>();
  isSubmit: boolean = false;
  emptyField = formErrors.message_emptyField;

  /**
   * @constructor
   * @param populateService - service for populate the selects.
   * @param cs - service for communicate all the components.
   * @param _fb
   * @param completerService - autocomplete
   */
  constructor(private populateService: PopulateService, private cs: CommunicateService, private _fb: FormBuilder, private completerService: CompleterService) {
    this.stairForm = this._fb.group({
      cant: [1, Validators.required],
      model: ['', Validators.required],
      structures: this._fb.array([
        this.initStructure(),
      ]),
      treads: this._fb.array([
        this.initTread(),
      ]),
      accessories: this._fb.array([
      ]),
      railing: this._fb.group({
        model: ['', Validators.required],
        cantStraight: [1, Validators.required],
        cantCurve: [1, Validators.required],
        railing: ['', Validators.required],
        finish: ['', Validators.required]
      }),
      guardrail: this._fb.group({
        activeGuardrail: [false],
        model: [{value: '', disabled: true}],
        cantStraight: [{value: 1, disabled: true}],
        cantCurve: [{value: 1, disabled: true}],
        railing: [{value: '', disabled: true}],
        finish: [{value: '', disabled: true}]
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
      /*this.calculateTreadPrice(data);
      this.calculateRailingPrice(data);
      this.calculateGuardrailPrice(data);
      this.calculateAccessoriesPrice(data);
      this.cs.validateForm(this.stairForm.valid, 'stair');
      this.cs.addZoho(this.stairForm.value, 'stair');*/

      // @TODO VER ESTO CON VANE PARA VERIFICAR
      this.totalStair = (this.subTotalTreads * this.stairForm.controls['cant'].value) + (this.subTotalAccessories * this.stairForm.controls['cant'].value) + (this.subTotalRailing * this.stairForm.controls['cant'].value) + this.subTotalGuardrail + this.subTotalStructures;
      this.notifyTotal.emit(this.totalStair);
    });

    this.cs.submitted.subscribe(
      data => this.isSubmit = data
    );
  }

  loadDataModel(e) {
    this.populateService.getTreadName(e.target.value).subscribe(data => this.populateTreadName = data);

    this.populateService.getStructure(e.target.value).subscribe(data => {
      this.populateStructure = data;
      this.subTotalStructures = 0;

      this.enableInputs('structures', 'type');
    });
  }

  /**
   * Enable all the first inputs
   * 
   * @param controlName - Control row
   * @param controlInput - Input field
   */
  enableInputs(controlName, controlInput) {
    for (var item of this.stairForm.controls[controlName]['controls']) {
      item.controls[controlInput].enable();
    }
  }

  /**
   * @return {FormGroup} Structure form
   */
  initStructure() {
    return this._fb.group({
      cant: [1, Validators.required],
      type: [{value: '', disabled: this.checkModelValue()}, Validators.required],
      finish: [{value: '', disabled: true}, Validators.required],
      price: [0]
    })
  }

  /**
   * @return {FormGroup} Tread form
   */
  initTread() {
    return this._fb.group({
      id: [0],
      cant: [1, Validators.required],
      treadName: ['', Validators.required],
      measure: ['', Validators.required],
      treadFinish: ['', Validators.required],
      price: [0]
    });
  }

  /**
   * @returns {FormGroup} Accessorie form
   */
  initAccessorie() {
    return this._fb.group({
      cant: [1, Validators.required],
      accessorieName: ['', Validators.required],
      type: ['structures'],
      id: [''],
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
      if (this.stairForm.value['model'] !== '') {
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
   * Calculate only the price of the structures
   *
   * @param data - Form values
   */
  calculateStructuresPrice(data) {
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
  calculateTreadPrice(data) {
    this.subTotalTreads = 0;
    var cont;

    for (var tread of this.populateTreadName) {
      cont = 0;
      for (var itemTread of data.treads) {
        if (tread.name === itemTread.treadName) {
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
   * Calculate only the price of the railing
   *
   * @param data - Form values
   */
  calculateRailingPrice(data) {
    var priceStraight = 0;
    var priceCurve = 0;
    var priceModel = 0;

    for (var model of this.populateModelsRailing) {
      if (model.name === data.railing.model) {
        priceStraight = model.priceStraight * data.railing.cantStraight;
        priceCurve = model.priceCurve * data.railing.cantCurve;
        priceModel = priceStraight + priceCurve;
      }
    }

    this.subTotalRailingStraight = priceStraight;
    this.subTotalRailingCurve = priceCurve;
    this.subTotalRailing = priceModel;
  }

  /**
   * Calculate only the price of the railing
   *
   * @param data - Form values
   */
  calculateGuardrailPrice(data) {
    var priceStraight = 0;
    var priceCurve = 0;
    var priceModel = 0;

    for (var model of this.populateModelsRailing) {
      if (model.name === data.guardrail.cantStraightmodel) {
        priceStraight = model.priceStraight * data.guardrail.cantStraight;
        priceCurve = model.priceCurve * data.guardrail.cantCurve;
        priceModel = priceStraight + priceCurve;
      }
    }

    this.subTotalGuardrailStraight = priceStraight;
    this.subTotalGuardrailCurve = priceCurve;
    this.subTotalGuardrail = priceModel;
  }

  /**
   * Calculate only the price of the accessories
   *
   * @param data - Form values
   */
  calculateAccessoriesPrice(data) {
    this.subTotalAccessories = 0;
    var cont;

    for (var accessorie of this.populateAccessories) {
      cont = 0;

      for (var itemAccessorie of data.accessories) {
        if (itemAccessorie['type'] === 'railing') {
          if (itemAccessorie['unitPrice'] === 'eur') {
            if (accessorie.name === itemAccessorie.accessorieName) {
              this.stairForm.value.accessories[cont].price = itemAccessorie.cant * accessorie.price;
            }
          } else if (itemAccessorie['unitPrice'] === 'porc'){
            if (accessorie.name === itemAccessorie.accessorieName) {
              this.stairForm.value.accessories[cont].price = ((this.subTotalRailing * accessorie.percentaje) / 100) * itemAccessorie.cant;
            }
          }
        } else {
          if (itemAccessorie['unitPrice'] === 'eur' && itemAccessorie['id']) {
            if (accessorie.name === itemAccessorie.accessorieName) {
              this.stairForm.value.accessories[cont].price = itemAccessorie.cant * accessorie.price;
            }
          } else if (itemAccessorie['unitPrice'] === 'porc' && itemAccessorie['id']) {
            if (accessorie.name === itemAccessorie.accessorieName) {
              this.stairForm.value.accessories[cont].price = ((this.stairForm.controls[itemAccessorie['type']]['controls'][itemAccessorie['id']].value.price * accessorie.percentaje) / 100) * itemAccessorie.cant;
            }
          }
        }

        cont++;
      }
    }

    for (var itemAccessorie of data.accessories) {
      this.subTotalAccessories = this.subTotalAccessories + itemAccessorie.price;
    }
  }

  /**
   * Get the data to populate the stair models
   */
  populateSelectModels() {
    this.populateService.getMeasureModels().subscribe(data => this.populateModels = data);
  }

  /**
   * Enable the accessorie id select
   */
  checkApply(accessorie, idAccessorie): void {
    if (accessorie['controls']['type'].value === 'railing') {
      accessorie['controls']['unitPrice'].setValue(null);
      accessorie['controls']['id'].setValue(null);
    }
  }

  /**
   * Enable or Disable the Guardrail Form
   */
  checkGuardrail(): void {
    if (this.stairForm.controls['guardrail']['controls']['activeGuardrail'].value) {
      this.stairForm.controls['guardrail'].enable();
    } else {
      this.stairForm.controls['guardrail']['controls']['model'].disable();
      this.stairForm.controls['guardrail']['controls']['cantStraight'].disable();
      this.stairForm.controls['guardrail']['controls']['cantCurve'].disable();
      this.stairForm.controls['guardrail']['controls']['finish'].disable();
      this.stairForm.controls['guardrail']['controls']['railing'].disable();
    }
  }
}
