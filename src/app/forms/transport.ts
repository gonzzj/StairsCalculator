import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CommunicateService} from '../services/CommunicateService';
import {formErrors} from '../constants';

@Component({
    selector: 'transport',
    template: require('./transport.html')
})

/** Class transport child component */
export class TransportComponent implements OnInit {
  populateZones: any;

  private transportsForm: FormGroup;

  subTotalTransports: number = 0;
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
    this.transportsForm = this._fb.group({
      transports: this._fb.array([
      ])
    });
  }

  /**
   * Populate the selects, calculate the transport price when the form change and add the values to a JSON
   */
  ngOnInit() {
    this.populateSelects();

    this.transportsForm.valueChanges.subscribe(data => {
      this.calculateTransportPrice(data);
      this.notifyTotal.emit(this.subTotalTransports);
      this.cs.validateForm(this.transportsForm.valid, "transport");
      this.cs.addZoho(this.transportsForm.value['transports'], "transport");
    });

    this.cs.submitted.subscribe(
      data => this.isSubmit = data
    );
  }

  /**
   * @return {FormGroup} A transport form
   */
  initTransport() {
    return this._fb.group({
      cant: [1, Validators.required],
      zoneName: ['', Validators.required]
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
   * @param i - id row form
   */
  removeRow(i: number) {
    const control = <FormArray>this.transportsForm.controls['transports'];
    control.removeAt(i);
  }

  /**
   * Calculate the price of the transport
   *
   * @param data - the form values
   * @returns {number}
   */
  calculateTransportPrice(data) {
    this.subTotalTransports = 0;

    for (var zone of this.populateZones) {
      for (var itemTransport of data.transports) {
        if (zone.name == itemTransport.zoneName) {
          this.subTotalTransports = this.subTotalTransports + (itemTransport.cant * zone.price);
        }
      }
    }
  }

  /**
   * Get the data to populate the selects
   */
  populateSelects() {
    /*this.populateService.getZones()
      .then(data => {
        this.populateZones = data;
      });*/
  }
}
