import {Component} from '@angular/core';

@Component({
  selector: 'fountain-header',
  template: require('./header.html')
})
export class HeaderComponent {
  logo: string;
  numOrder: number;
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
    this.numOrder = 3;
    this.client = 'Juan Perez Carreras';
    this.seller = 'Gabriele Brignoli';
    this.date = dd + '/' + mm + '/' + yyyy;
  }
}
