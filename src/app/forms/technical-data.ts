import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {FormArray, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CommunicateService} from '../services/CommunicateService';

@Component({
    selector: 'technical-data',
    template: require('./technical-data.html')
})
export class TechnicalDataComponent implements OnInit {
  @Output() selectedStair: EventEmitter<string> = new EventEmitter<string>();

  private technicalDataForm: FormGroup;

  constructor(private _fb: FormBuilder, private cs: CommunicateService) {
    this.technicalDataForm = this._fb.group({
      config: [''],
      cantTreads: [1],
      heightTreads: [1],
      widthTreads: [1],
      diameter: [1],
      heightTotal: [1],
      heightGround: [1],
      heightHole: [1],
      longHole: [1]
    });
  }

  ngOnInit() {
    this.technicalDataForm.valueChanges.subscribe(data => {
      this.cs.addZoho(this.technicalDataForm.value, "technicalData");
    });
  }

  getStair(stair) {
    this.selectedStair.emit(stair);
  }
}
