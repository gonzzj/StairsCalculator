import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'transport',
    template: require('./transport.html')
})
export class TransportComponent implements OnInit {
  populateZones: any;

  private transportsForm: FormGroup;

  subTotalTransports: number = 0;
  @Output() notifyTotal: EventEmitter<number> = new EventEmitter<number>();

  constructor(private populateService: PopulateService, private _fb: FormBuilder) {
    this.transportsForm = this._fb.group({
      transports: this._fb.array([
        this.initTransport(),
      ])
    });
  }

  ngOnInit() {
    this.populateSelects();

    this.transportsForm.valueChanges.subscribe(data => {
      this.calculateTransportPrice(data);
      this.notifyTotal.emit(this.subTotalTransports);
    });
  }

  initTransport() {
    return this._fb.group({
      cant: [1],
      zoneName: ['']
    });
  }

  addRow() {
    const control = <FormArray>this.transportsForm.controls['transports'];
    control.push(this.initTransport());
  }

  removeRow(i: number) {
    const control = <FormArray>this.transportsForm.controls['transports'];
    control.removeAt(i);
  }

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

  populateSelects() {
    this.populateService.getZones()
      .then(data => {
        this.populateZones = data;
      });
  }
}
