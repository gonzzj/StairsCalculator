import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import {CommunicateService} from '../services/CommunicateService';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {formErrors} from '../constants';
import {CompleterService, CompleterData} from 'ng2-completer';

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
      idModel: [0],
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
        model: [{value: "", disabled: true}],
        cantStraight: [{value: 1, disabled: true}],
        cantCurve: [{value: 1, disabled: true}],
        railing: [{value: "", disabled: true}],
        finish: [{value: "", disabled: true}]
      })
    });
  }

  /**
   * Populate the selects, calculate the stair price when the form change and add the values to a JSON
   */
  ngOnInit() {
    this.populateSelects();

    this.stairForm.valueChanges.subscribe(data => {
      /*this.calculateStructuresPrice(data);
      this.calculateTreadPrice(data);
      this.calculateRailingPrice(data);
      this.calculateGuardrailPrice(data);
      this.calculateAccessoriesPrice(data);
      this.totalStair = (this.subTotalTreads * this.stairForm.controls['cant'].value) + (this.subTotalAccessories * this.stairForm.controls['cant'].value) + (this.subTotalRailing * this.stairForm.controls['cant'].value) + this.subTotalGuardrail + this.subTotalStructures + this.calculateModelPrice(data);
      this.notifyTotal.emit(this.totalStair);
      this.cs.validateForm(this.stairForm.valid, 'stair');
      this.cs.addZoho(this.stairForm.value, 'stair');*/
      console.log(this.stairForm);
    });


    // @TODO
    this.stairForm.controls['model'].valueChanges.subscribe(data => {
      for (var model of this.populateModels) {
        if (model.name === data) {
          this.stairForm.controls['idModel'].setValue(model.id);
          this.populateService.getTreadName(model.id)
            .then(data => {
              this.populateTreadName = data;
            });

          this.populateService.getStructure(model.id)
            .then(data => {
              this.populateStructure = data;
            });
        }
      }
    });
    

    this.cs.submitted.subscribe(
      data => this.isSubmit = data
    );
  }

  /**
   * @return {FormGroup} Structure form
   */
  initStructure() {
    return this._fb.group({
      cant: [1, Validators.required],
      type: ['', Validators.required],
      finish: ['', Validators.required],
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
  calculateModelPrice(data) {
    var priceModel = 0;

    for (var model of this.populateModels) {
      if (model.name === data.model) {
        priceModel = model.price;
      }
    }

    return priceModel;
  }

  /**
   * Calculate only the price of the structures
   *
   * @param data - the form values
   */
  calculateStructuresPrice(data) {
    var cont;
    this.subTotalStructures = 0;
    for (var structure of this.populateStructure) {
      cont = 0;
      for (var itemStructure of data.structures) {
        if (structure.name === itemStructure.finish) {
          this.stairForm.value.structures[cont].price = structure.price * itemStructure.cant;
          this.calculateAccessoriesPrice(data);
        }
        cont++;
      }
    }

    for (var itemStructure of data.structures) {
      this.subTotalStructures = this.subTotalStructures + itemStructure.price;
    }
  }

  /**
   * Calculate only the price of the railing
   *
   * @param data - the form values
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
   * @param data - the form values
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
   * Get the data to populate the selects
   */
  populateSelects() {
    this.populateService.getMeasureModels()
      .then(data => {
        this.populateModels = data;
      });

    /*
    this.populateService.getTreadFinish()
      .then(data => {
        this.populateTreadFinish = data;
      });

    this.populateService.getMeasure()
      .then(data => {
        this.populateMeasure = data;
      });*/

    /*this.populateService.getAccessories()
      .then(data => {
        this.populateAccessories = data;
      });

    this.populateService.getModelsRailing()
      .then(data => {
        this.populateModelsRailing = data;
      });*/
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
