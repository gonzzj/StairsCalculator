import {Injectable, EventEmitter} from '@angular/core';
import {stairTypes} from '../constants';
import {Http, Headers, RequestOptions, URLSearchParams} from '@angular/http';

@Injectable()

/** Class Communicate forms components */
export class CommunicateService {
  submitted: EventEmitter<boolean> = new EventEmitter<boolean>();
  zohoForm: any;
  isValidForm: boolean = false;
  validForms: Array<Object>;
  body: any = new URLSearchParams();

  /**
   * @constructor
   */
  constructor(private http: Http) {
    this.zohoForm = {
      "stairType": "",
      "technicalData": {},
      "stair": {},
      "services": {},
      "transport": {},
      "extras": {},
      "observations": "",
      "subTotal": {},
      "discount": {},
      "total": 0
    };

    this.validForms = [
      {
        technicalData: false,
        stair: false,
        services: true,
        transport: true,
        extras: true
      }
    ];
  }

  /**
   * Send to the child components if the submit button was clicked
   *
   * @param value - the state of the button
   */
  isSubmit(value: boolean) {
    this.submitted.emit(value);
  }

  /**
   * Validate all the child forms components
   *
   * @param validForm - The state of the form validation
   * @param nameForm - the name of the form
   */
  validateForm(validForm: boolean, nameForm: string) {
    this.validForms[0][nameForm] = validForm;

    if (this.validForms[0]['technicalData'] === true && this.validForms[0]['stair'] === true && this.validForms[0]['transport'] === true && this.validForms[0]['services'] === true && this.validForms[0]['extras'] === true) {
      this.isValidForm = true;
    } else {
      this.isValidForm = false;
    }
  }

  /**
   * Add the part of the child component to the JSON of Zoho
   *
   * @param form - The JSON of the child component
   * @param nameForm - the name of the form
   */
  addZoho(form: any, nameForm: string) {
    this.zohoForm[nameForm] = form;
  }

  /**
   * Add user data to the JSON of Zoho
   */
  addZohoUser(order: number, quoting: number, idClient: number, client: string, seller: string, formatDate: any) {
    this.body.set('nroPedido', order);
    this.body.set('cotizador', quoting);
    this.body.set('idCliente', idClient);
    this.body.set('nombreCliente', client);
    this.body.set('nombreCotizador', seller);
    this.body.set('fechaValidez', formatDate);
  }

  /**
   * Send the complete JSON to Zoho
   */
  sendZoho(stairType: any) {
    if (this.isValidForm === true) {
      if (stairType === 'measure') {
        this.zohoForm['stairType'] = stairTypes.measure;
      } else if (stairType === 'kit') {
        this.zohoForm['stairType'] = stairTypes.kit;
      } else {
        this.zohoForm['stairType'] = stairTypes.esc;
      }

      this.body.set('precioFinal', this.zohoForm['total']);
      this.body.set('json', JSON.stringify(this.zohoForm));

      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
      let options = new RequestOptions({ headers: headers });

      this.http.post('http://admin.proclen.com/rest/presupuestos', this.body, options).subscribe(data => {
        console.log(data);
      });
    } else {
      window.scrollTo(0, 0);
    }
  }

  /**
   * Ask for the validation and if it's correct, it will create the PDF to print
   */
  savePDF(stairType: any) {
    if (this.isValidForm === true) {
      window.print();
    } else {
      window.scrollTo(0, 0);
    }
  }
}
