import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CommunicateService} from '../services/CommunicateService';
import {formErrors} from '../constants';
import { Input } from '@angular/core/src/metadata/directives';
import { SimpleChanges, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'services',
    template: require('./services.html')
})

/** Class service child component */
export class ServicesComponent implements OnInit, OnChanges {
  @Input('stairData') stairData: Array<Object>;
  @Input('stairName') stairName: string;
  populateServices: any;
  populateServicesZones: any;

  private servicesForm: FormGroup;

  subTotalServices: number = 0;
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
    this.servicesForm = this._fb.group({
      services: this._fb.array([
      ])
    });
  }

  /**
   * Populate the selects, calculate the service price when the form change and add the values to a JSON
   */
  ngOnInit() {
    this.servicesForm.valueChanges.subscribe(data => {
      this.calculateServicePrice(data);
      this.notifyTotal.emit(this.subTotalServices);
      this.cs.validateForm(this.servicesForm.valid, "services");
      this.cs.addZoho(this.servicesForm.value['services'], "services");
    });

    this.cs.submitted.subscribe(
      data => this.isSubmit = data
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      if (typeof this.stairData !== 'undefined') {
        if (this.stairData[0]['stairModelId'] !== '') {
          this.populateServiceSelects();

          this.enableInputs();
        }
      }

      if (typeof changes['stairName'] !== 'undefined') {
        if (changes['stairName']['currentValue'] !== changes['stairName']['previousValue']) {
          this.servicesForm = this._fb.group({
            services: this._fb.array([
            ])
          });

          // @TODO arreglar bug cuando cambia el stair type
        }
      }
    });
  }

  /**
   * Get the data to populate the selects
   */
  populateServiceSelects() {
    if (typeof this.stairData !== 'undefined') {
      this.populateService.getServices(this.stairData).subscribe(data => this.populateServices = data);
      
      this.populateService.getServicesZones().subscribe(data => this.populateServicesZones = data);
    }
  }

  enableInputs() {
    if (this.servicesForm.controls['services']['controls'].length != 0) {
      for (let item of this.servicesForm.controls['services']['controls']) {
        item.controls['serviceName'].enable();
        item.controls['zone'].enable();
      }
    }
  }
  
  /**
   * Check if the model has a value
   * 
   * @returns {boolean} disableInput
   */
  checkModelValue() {
    let disableInput : boolean = true;

    if (typeof this.stairData !== 'undefined') {
      if (this.stairData[0]['stairModelId'] !== '') {
        disableInput = false;
      }
    }

    return disableInput;
  }

  /**
   * @return {FormGroup} A service form
   */
  initService() {
    return this._fb.group({
      cant: [1, Validators.required],
      zone: [{value: '', disabled: this.checkModelValue()}, Validators.required],
      serviceName: [{value: '', disabled: this.checkModelValue()}, Validators.required],
      price: [0]
    });
  }

  /**
   * Add a new service form
   */
  addRow() {
    const control = <FormArray>this.servicesForm.controls['services'];
    control.push(this.initService());
  }

  /**
   * Remove a service form
   *
   * @param controlInput - row form
   */
  removeRow(controlInput: any) {
    const control = <FormArray>this.servicesForm.controls[controlInput.name];
    control.removeAt(controlInput.index);
  }

  /**
   * Calculate the price of the services
   *
   * @param data - the form values
   */
  calculateServicePrice(data) {
    this.subTotalServices = 0;
    
    for (var itemService of data.services) {
      this.subTotalServices = this.subTotalServices + itemService.price;
    }
  }
}
