import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'extras',
    template: require('./extras.html')
})
export class ExtrasComponent implements OnInit {
  private extrasForm: FormGroup;

  subTotalExtras: number = 0;
  @Output() notifyTotal: EventEmitter<number> = new EventEmitter<number>();

  constructor(private _fb: FormBuilder) {
    this.extrasForm = this._fb.group({
      extras: this._fb.array([
      ])
    });
  }

  ngOnInit() {
    this.extrasForm.valueChanges.subscribe(data => {
      this.calculateExtrasPrice(data);
      this.notifyTotal.emit(this.subTotalExtras);
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
    this.subTotalExtras = 0;

    for (var itemExtra of data.extras) {
      this.subTotalExtras = this.subTotalExtras + (itemExtra.cant * itemExtra.price);
    }
  }
}
