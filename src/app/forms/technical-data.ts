import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CommunicateService} from '../services/CommunicateService';
import {formErrors} from '../constants';

@Component({
    selector: 'technical-data',
    template: require('./technical-data.html')
})
export class TechnicalDataComponent implements OnInit {
  @Output() selectedStair: EventEmitter<string> = new EventEmitter<string>();
  isSubmit: boolean = false;
  emptyField = formErrors.message_emptyField;

  private technicalDataForm: FormGroup;

  /**
   * @constructor
   * @param _fb
   * @param cs - service for communicate all the components.
   */
  constructor(private _fb: FormBuilder, private cs: CommunicateService) {
    this.technicalDataForm = this._fb.group({
      config: ['', Validators.required],
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

  /**
   * Add the values to a JSON if the form changes
   */
  ngOnInit() {
    this.technicalDataForm.valueChanges.subscribe(data => {
      this.cs.validateForm(this.technicalDataForm.valid, "technicalData");
      this.cs.addZoho(this.technicalDataForm.value, "technicalData");
    });

    this.cs.submitted.subscribe(
      data => this.isSubmit = data
    );
  }

  /**
   * Send to the father component the chosen stair
   */
  getStair(stair) {
    this.selectedStair.emit(stair);
    this.cs.validateForm(false, "stair");
  }
}
