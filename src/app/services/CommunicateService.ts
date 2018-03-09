import {Injectable, EventEmitter} from '@angular/core';
import {stairTypes} from '../constants';
import {extrasTypes} from '../constants';
import {Http, Headers, RequestOptions} from '@angular/http';

@Injectable()

/** Class Communicate forms components */
export class CommunicateService {
  submitted: EventEmitter<boolean> = new EventEmitter<boolean>();
  zohoForm: any;
  validForms: Array<Object>;
  isValidForm: boolean = false;
  urlZoho: string = '​http://admin.proclen.com/rest/presupuestos';

  /**
   * @constructor
   */
  constructor(private http: Http) {
    this.zohoForm = {
      "nroPedido": 0,
      "cotizador": "",
      "idCliente": 0,
      "nombreCliente": "",
      "nombreCotizador": "",
      "fechaValidez": "",
      "precioFinal": 0,
      "json": {
        "stairType": "",
        "technicalData": [],
        "stair": [],
        "services": [],
        "transport": [],
        "extras": [],
        "observations": [],
        "subTotal": [],
        "discount": [],
        "total": 0
      }
    }

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
  addZoho(form, nameForm) {
    this.zohoForm['json'][nameForm] = form;
  }

  /**
   * Add user data to the JSON of Zoho
   */
  addZohoUser(order, quoting, idClient, client, seller, formatDate) {
    this.zohoForm['nroPedido'] = order;
    this.zohoForm['cotizador'] = quoting;
    this.zohoForm['idCliente'] = idClient;
    this.zohoForm['nombreCliente'] = client;
    this.zohoForm['nombreCotizador'] = seller;
    this.zohoForm['fechaValidez'] = formatDate;
  }

  /**
   * Send the complete JSON to Zoho
   */
  sendZoho(stairType) {
    //if (this.isValidForm === true) {
      if (stairType == "measure") {
        this.zohoForm['json']['stairType'] = stairTypes.measure;
      } else if (stairType == "kit") {
        this.zohoForm['json']['stairType'] = stairTypes.kit;
      } else {
        this.zohoForm['json']['stairType'] = stairTypes.esc;
      }

      this.zohoForm['precioFinal'] = this.zohoForm['json']['total']

      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      console.log(this.urlZoho);
      console.log(JSON.stringify(this.zohoForm));
      console.log(options);

      this.http.post(this.urlZoho, JSON.stringify(this.zohoForm), options)
        .map(res => { res.json(); console.log(res); })
        .subscribe(data => {
          console.log(data);
        });
    //} else {
    //window.scrollTo(0, 0);
    //}
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

