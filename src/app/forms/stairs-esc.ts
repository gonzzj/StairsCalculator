import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {PopulateService} from '../services/PopulateService';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {CommunicateService} from '../services/CommunicateService';

@Component({
    selector: 'stairs-esc',
    template: require('./stairs-esc.html')
})
export class StairsEscComponent implements OnInit {
  populateModels: any;
  populateAccessories: any;

  private stairForm: FormGroup;

  subTotalAccessories: number = 0;
  totalStair: number = 0;

  @Output() notifyTotal: EventEmitter<number> = new EventEmitter<number>();

  constructor(private populateService: PopulateService, private _fb: FormBuilder, private cs: CommunicateService) {
    this.stairForm = this._fb.group({
      model: [''],
      measure: [''],
      accessories: this._fb.array([
      ])
    });
  }

  ngOnInit() {
    this.populateSelects();

    this.stairForm.valueChanges.subscribe(data => {
      this.calculateAccessoriesPrice(data);
      this.totalStair = this.subTotalAccessories + this.calculateModelPrice(data);
      this.notifyTotal.emit(this.totalStair);
      this.cs.addZoho(this.stairForm.value, "stair");
    });
  }

  initAccessorie() {
    return this._fb.group({
      cant: [1],
      accessorieName: [''],
      price: [0]
    });
  }

  addRow() {
    const control = <FormArray>this.stairForm.controls['accessories'];
    control.push(this.initAccessorie());
  }

  removeRow(i: number) {
    const control = <FormArray>this.stairForm.controls['accessories'];
    control.removeAt(i);
  }

  calculateModelPrice(data) {
    var priceModel = 0;

    for (var model of this.populateModels) {
      if (model.name == data.model) {
        priceModel = model.price;
      }
    }

    return priceModel;
  }

  calculateAccessoriesPrice(data) {
    this.subTotalAccessories = 0;
    var cont;

    for (var accessorie of this.populateAccessories) {
      cont = 0;
      for (var itemAccessorie of data.accessories) {
        if (accessorie.name == itemAccessorie.accessorieName) {
          this.stairForm.value.accessories[cont].price = itemAccessorie.cant * accessorie.price;
        }
        cont++;
      }
    }

    for (var itemAccessorie of data.accessories) {
      this.subTotalAccessories = this.subTotalAccessories + itemAccessorie.price;
    }
  }

  populateSelects() {
    this.populateService.getAllModels()
      .then(data => {
        this.populateModels = data;
      });

    this.populateService.getAccessories()
      .then(data => {
        this.populateAccessories = data;
      });
  }
}
