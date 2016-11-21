import {Injectable, EventEmitter} from "@angular/core";

@Injectable()
export class CommunicateService {
  submitted: EventEmitter<boolean> = new EventEmitter<boolean>();
  zohoForm: Array<Object>;

  constructor() {
    this.zohoForm = [
      {
        technicalData: [],
        stair: [],
        services: [],
        transport: [],
        extras: [],
        observations: [],
        subTotal: [],
        discount: [],
        total: []
      }
    ];
  }

  isSubmit(value: boolean) {
    this.submitted.emit(value);
  }

  addZoho(form, nameForm) {
    this.zohoForm[0][nameForm] = form;
  }

  sendZoho() {
    console.log(JSON.stringify(this.zohoForm, null, 2));
  }
}
