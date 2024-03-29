import {Component, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CommunicateService} from '../services/CommunicateService';
import { Input } from '@angular/core/src/metadata/directives';
import { SimpleChanges, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'transport',
    template: require('./transport.html')
})

/** Class transport child component */
export class TransportComponent implements OnChanges {
  @Input('stairData') stairData: Array<Object>;
  @Input('stairName') stairName: string;
  @Output() notifyTotal: EventEmitter<number> = new EventEmitter<number>();
  populateZones: any;
  subTotalTransports: number = 0;
  isSubmit: boolean = false;

  private transportsForm: FormGroup;
  /**
   * @constructor
   * @param populateService - service to populate the selects.
   * @param _fb
   * @param cs - service to communicate all the components.
   */
  constructor(private populateService: PopulateService, private _fb: FormBuilder, private cs: CommunicateService) {
    this.transportsForm = this._fb.group({
      transports: this._fb.array([
      ])
    });
  }

  /**
   * Populate the selects, calculate the transport price when the form change and add the values to a JSON
   */

  ngOnChanges(changes: SimpleChanges) {
    this.transportsForm.valueChanges.subscribe(data => {
      this.calculateTransportPrice(data);
      this.notifyTotal.emit(this.subTotalTransports);
      this.cs.validateForm(this.transportsForm.valid, 'transport');
      this.cs.addZoho(this.transportsForm.value['transports'], 'transport');
    });

    this.cs.submitted.subscribe(
      data => this.isSubmit = data
    );

    if (typeof this.stairData !== 'undefined') {
      if (this.stairData[0]['stairModelId'] !== '') {
          this.populateTransportSelects();

          this.enableInputs();
      }
    }

    if (typeof changes['stairName'] !== 'undefined') {
      if (changes['stairName']['currentValue'] !== changes['stairName']['previousValue']) {
        this.transportsForm = this._fb.group({
          transports: this._fb.array([
          ])
        });
      }
    }
  }

  /**
   * Get the data to populate the selects
   */
  populateTransportSelects() {
    if (typeof this.stairData !== 'undefined') {
      this.populateService.getTransportPrices(this.stairData).subscribe(data => this.populateZones = data);
    }
  }

  enableInputs() {
    if (this.transportsForm.controls['transports']['controls'].length !== 0) {
      for (let item of this.transportsForm.controls['transports']['controls']) {
        item.controls['zoneName'].enable();
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
   * @return {FormGroup} The transport form
   */
  initTransport() {
    return this._fb.group({
      cant: [1, Validators.required],
      zoneName: [{value: 0, disabled: this.checkModelValue()}, Validators.required],
      price: [0]
    });
  }

  /**
   * Add a new transport form
   */
  addRow() {
    const control = <FormArray>this.transportsForm.controls['transports'];
    control.push(this.initTransport());
  }

  /**
   * Remove a transport form
   *
   * @param controlInput - row form
   */
  removeRow(controlInput: any) {
    const control = <FormArray>this.transportsForm.controls[controlInput.name];
    control.removeAt(controlInput.index);
  }

  /**
   * Calculate the price of the transport
   *
   * @param data - the form values
   */
  calculateTransportPrice(data: any) {
    this.subTotalTransports = 0;

    for (var itemTransport of data.transports) {
      this.subTotalTransports = this.subTotalTransports + itemTransport.price;
    }
  }
}
