import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';

import {StairsComponent} from './stairs';
import {TechnicalDataComponent} from './technical-data';
import {ServicesComponent} from './services';
import {TransportComponent} from './transport';
import {ObservationComponent} from './observation';
import {SubTotalComponent} from './subtotal';
import {TotalComponent} from './total';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  declarations: [
    StairsComponent,
    TechnicalDataComponent,
    ServicesComponent,
    TransportComponent,
    ObservationComponent,
    SubTotalComponent,
    TotalComponent
  ],
  exports: [
    StairsComponent
  ]
})
export class StairsModule {}
