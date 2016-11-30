import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CommunicateService} from '../services/CommunicateService';
import {formErrors} from '../constants';

@Component({
    selector: 'services',
    template: require('./services.html')
})

/** Class service child component */
export class ServicesComponent implements OnInit {
  populateServices: any;

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
    this.populateSelects();

    this.servicesForm.valueChanges.subscribe(data => {
      this.calculateServicePrice(data);
      this.notifyTotal.emit(this.subTotalServices);
      this.cs.addZoho(this.servicesForm.value['services'], "services");
    });

    this.cs.submitted.subscribe(
      data => this.isSubmit = data
    );
  }

  /**
   * @return {FormGroup} A service form
   */
  initService() {
    return this._fb.group({
      cant: [1],
      type: ['', Validators.required],
      serviceName: ['', Validators.required]
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
   * @param i - id row form
   */
  removeRow(i: number) {
    const control = <FormArray>this.servicesForm.controls['services'];
    control.removeAt(i);
  }

  /**
   * Calculate the price of the services
   *
   * @param data - the form values
   * @returns {number}
   */
  calculateServicePrice(data) {
    this.subTotalServices = 0;

    for (var service of this.populateServices) {
      for (var itemService of data.services) {
        if (service.name == itemService.serviceName) {
          this.subTotalServices = this.subTotalServices + (itemService.cant * service.price);
        }
      }
    }
  }

  /**
   * Get the data to populate the selects
   */
  populateSelects() {
    this.populateService.getServices()
      .then(data => {
        this.populateServices = data;
      });
  }
}
