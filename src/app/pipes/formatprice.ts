import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatprice'})
export class FormatPricePipe implements PipeTransform {
  transform(value: number, args: string[]): any {
    var coin: string;

    coin = value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    return coin;
  }
}
