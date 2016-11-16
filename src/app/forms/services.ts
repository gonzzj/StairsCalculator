import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
    selector: 'services',
    template: require('./services.html')
})
export class ServicesComponent implements OnInit {
  populateServices: any;

  private servicesForm: FormGroup;

  subTotalServices: number = 0;
  @Output() notifyTotal: EventEmitter<number> = new EventEmitter<number>();

  constructor(private populateService: PopulateService, private _fb: FormBuilder) {
    this.servicesForm = this._fb.group({
      services: this._fb.array([
        this.initService(),
      ])
    });
  }

  ngOnInit() {
    this.populateSelects();

    this.servicesForm.valueChanges.subscribe(data => {
      this.calculateServicePrice(data);
      this.notifyTotal.emit(this.subTotalServices);
    });
  }

  initService() {
    return this._fb.group({
      cant: [1],
      type: [''],
      serviceName: ['']
    });
  }

  addRow() {
    const control = <FormArray>this.servicesForm.controls['services'];
    control.push(this.initService());
  }

  removeRow(i: number) {
    const control = <FormArray>this.servicesForm.controls['services'];
    control.removeAt(i);
  }

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

  populateSelects() {
    this.populateService.getServices()
      .then(data => {
        this.populateServices = data;
      });
  }
}
