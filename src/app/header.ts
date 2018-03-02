import {Component} from '@angular/core';

@Component({
  selector: 'fountain-header',
  template: require('./header.html')
})
export class HeaderComponent {
  logo: string;
  idOrder: number;
  client: string;
  seller: string;
  date: string;

  constructor() {
    let date = new Date();
    let dd: string;
    let mm: string;
    let yyyy = date.getFullYear();

    if (date.getDate() < 10) {
      dd = '0' + date.getDate();
    }

    if ((date.getMonth() + 1) < 10) {
      mm = '0' + (date.getMonth() + 1);
    }

    this.logo = '../img/logo.png';
    this.idOrder = this.findGetParameter('id_pedido');
    this.client = this.findGetParameter('cliente');
    this.seller = this.findGetParameter('user');
    this.date = dd + '/' + mm + '/' + yyyy;
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
