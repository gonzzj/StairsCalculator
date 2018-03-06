import {Injectable, EventEmitter} from '@angular/core';
import {stairTypes} from '../constants';
import {extrasTypes} from '../constants';
import {Http, Headers, RequestOptions} from '@angular/http';

@Injectable()

/** Class Communicate forms components */
export class CommunicateService {
  submitted: EventEmitter<boolean> = new EventEmitter<boolean>();
  zohoForm: Array<Object>;
  validForms: Array<Object>;
  isValidForm: boolean = false;
  urlZoho: '​http://admin.proclen.com/rest/presupuestos';

  /**
   * @constructor
   */
  constructor(private http: Http) {
    this.zohoForm = [{
      nroPedido: 0,
      cotizador: '',
      idCliente: 0,
      nombreCliente: '',
      nombreCotizador: '',
      fechaValidez: '',
      stairData: {
        stairType: '',
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
    }];

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
   * Add zoho form to the JSON part of the child component
   *
   * @param form - The JSON of the child component
   * @param nameForm - the name of the form
   */
  addZoho(form, nameForm) {
    this.zohoForm[0]['stairData'][nameForm] = form;
  }

  /**
   * Add user data to zoho form the JSON
   */
  addZohoUser(order, quoting, idClient, client, seller, formatDate) {
    this.zohoForm[0]['nroPedido'] = order;
    this.zohoForm[0]['cotizador'] = quoting;
    this.zohoForm[0]['idCliente'] = idClient;
    this.zohoForm[0]['nombreCliente'] = client;
    this.zohoForm[0]['nombreCotizador'] = seller;
    this.zohoForm[0]['fechaValidez'] = formatDate;
  }

  /**
   * Send to zoho the complete JSON
   */
  sendZoho(stairType) {
    if (stairType == "measure") {
      this.zohoForm[0]['stairData']['stairType'] = stairTypes.measure;
    } else if (stairType == "kit") {
      this.zohoForm[0]['stairData']['stairType'] = stairTypes.kit;
    } else {
      this.zohoForm[0]['stairData']['stairType'] = stairTypes.esc;
    }
    
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.http.post(this.urlZoho, JSON.stringify(this.zohoForm), options).map(res => res.json().subscribe(data => {
      console.log('ok');
    }));
  }

  /**
   * Ask for the validation and if it's correct, it will create the PDF to print
   */
  savePDF(stairType) {
    if (this.isValidForm === true) {
      window.print();
    } else {
      window.scrollTo(0, 0);
    }
  }

  formatPrice(value) {
    var coin: string;

    coin = value.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

    return coin;
  }
}

