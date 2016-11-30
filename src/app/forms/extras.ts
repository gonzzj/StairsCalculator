import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CommunicateService} from '../services/CommunicateService';
import {formErrors} from '../constants';

@Component({
    selector: 'extras',
    template: require('./extras.html')
})

/** Class extras child component */
export class ExtrasComponent implements OnInit {
  private extrasForm: FormGroup;

  totalExtras: number = 0;
  subTotalExtras: Array<Object>;
  @Output() notifyTotal: EventEmitter<Array<Object>> = new EventEmitter<Array<Object>>();
  isSubmit: boolean = false;
  emptyField = formErrors.message_emptyField;

  /**
   * @constructor
   * @param _fb
   * @param cs - service for communicate all the components.
   */
  constructor(private _fb: FormBuilder, private cs: CommunicateService) {
    this.subTotalExtras = [
      {
        extraStair: 0,
        extraTransport: 0,
        extraService: 0,
        extraExtras: 0
      }
    ];

    this.extrasForm = this._fb.group({
      extras: this._fb.array([
      ])
    });
  }

  /**
   * Populate the selects, calculate the extras price when the form change and add the values to a JSON
   */
  ngOnInit() {
    this.extrasForm.valueChanges.subscribe(data => {
      this.calculateExtrasPrice(data);
      this.notifyTotal.emit(this.subTotalExtras);
      this.cs.validateForm(this.extrasForm.valid, "extras");
      this.cs.addZoho(this.extrasForm.value['extras'], "extras");
    });

    this.cs.submitted.subscribe(
      data => this.isSubmit = data
    );
  }

  /**
   * @return {FormGroup} An extra form
   */
  initExtra() {
    return this._fb.group({
      cant: [1],
      extraName: ['', Validators.required],
      type: ['', Validators.required],
      price: [0]
    });
  }

  /**
   * Add a new extra form
   */
  addRow() {
    const control = <FormArray>this.extrasForm.controls['extras'];
    control.push(this.initExtra());
  }

  /**
   * Remove an extra form
   *
   * @param i - id row form
   */
  removeRow(i: number) {
    const control = <FormArray>this.extrasForm.controls['extras'];
    control.removeAt(i);
  }

  /**
   * Calculate the price of the extras
   *
   * @param data - the form values
   * @returns {number}
   */
  calculateExtrasPrice(data) {
    this.totalExtras = 0;
    this.subTotalExtras = [{extraStair: 0, extraTransport: 0, extraService: 0, extraExtras: 0}];

    for (var itemExtra of data.extras) {
      if (itemExtra.type == "stair") {
        this.subTotalExtras[0]["extraStair"] = this.subTotalExtras[0]["extraStair"] + (itemExtra.cant * itemExtra.price);
      } else if (itemExtra.type == "service") {
        this.subTotalExtras[0]["extraService"] = this.subTotalExtras[0]["extraService"] + (itemExtra.cant * itemExtra.price);
      } else if (itemExtra.type == "transport") {
        this.subTotalExtras[0]["extraTransport"] = this.subTotalExtras[0]["extraTransport"] + (itemExtra.cant * itemExtra.price);
      } else if (itemExtra.type == "extras") {
        this.subTotalExtras[0]["extraExtras"] = this.subTotalExtras[0]["extraExtras"] + (itemExtra.cant * itemExtra.price);
      }

      this.totalExtras = this.totalExtras + (itemExtra.cant * itemExtra.price);
    }
  }
}
