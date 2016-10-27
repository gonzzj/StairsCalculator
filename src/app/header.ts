import {Component} from '@angular/core';

@Component({
  selector: 'fountain-header',
  template: require('./header.html')
})
export class HeaderComponent {
  numOrder: number;
  client: string;
  seller: string;

  constructor() {
    this.numOrder = 3;
    this.client = 'Juan Perez Carreras';
    this.seller = 'Gabriele Brignoli';
  }
}
