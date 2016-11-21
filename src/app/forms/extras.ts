import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CommunicateService} from '../services/CommunicateService';

@Component({
    selector: 'extras',
    template: require('./extras.html')
})
export class ExtrasComponent implements OnInit {
  private extrasForm: FormGroup;

  totalExtras: number = 0;
  subTotalExtras: Array<Object>;
  @Output() notifyTotal: EventEmitter<Array<Object>> = new EventEmitter<Array<Object>>();

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

  ngOnInit() {
    this.extrasForm.valueChanges.subscribe(data => {
      this.calculateExtrasPrice(data);
      this.notifyTotal.emit(this.subTotalExtras);
      this.cs.addZoho(this.extrasForm.value, "extras");
    });
  }

  initExtra() {
    return this._fb.group({
      cant: [1],
      extraName: [''],
      type: [''],
      price: [0]
    });
  }

  addRow() {
    const control = <FormArray>this.extrasForm.controls['extras'];
    control.push(this.initExtra());
  }

  removeRow(i: number) {
    const control = <FormArray>this.extrasForm.controls['extras'];
    control.removeAt(i);
  }

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
