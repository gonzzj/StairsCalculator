import {CommunicateService} from './services/CommunicateService';
import {Component} from '@angular/core';

@Component({
  selector: 'fountain-header',
  template: require('./header.html')
})
export class HeaderComponent {
  logo: string;
  idOrder: number;
  idClient: number;
  client: string;
  seller: string;
  date: string;
  quoting: string;

  constructor(private cs: CommunicateService) {
    let date = new Date();
    let dd: string;
    let mm: string;
    let yyyy = date.getFullYear();
    let formatDate: string;

    if (date.getDate() < 10) {
      dd = '0' + date.getDate();
    } else {
      dd = date.getDate().toString();
    }

    if ((date.getMonth() + 1) < 10) {
      mm = '0' + (date.getMonth() + 1);
    } else {
      mm = (date.getMonth() + 1).toString();
    }

    this.logo = '../img/logo.png';
    this.quoting = this.findGetParameter('cotizador');
    this.idOrder = this.findGetParameter('id_pedido');
    this.idClient = this.findGetParameter('id_cliente');
    this.client = this.findGetParameter('cliente');
    this.seller = this.findGetParameter('user');
    this.date = dd + '/' + mm + '/' + yyyy;

    formatDate = yyyy + '-' + mm + '-' + dd;
    this.cs.addZohoUser(this.idOrder, this.quoting, this.idClient, this.client, this.seller, formatDate);
  }

  findGetParameter(parameterName) {
    let result = null, tmp = [];
    let items = location.search.substr(1).split("&");
    let re = /\+/gi;
    for (let index = 0; index < items.length; index++) {
      tmp = items[index].split('=');
      if (tmp[0] === parameterName) {
        result = decodeURIComponent(tmp[1]);
      };
    }

    if (result != null) {
      result = result.replace(re, ' ');
    }
    return result;
  }
}
