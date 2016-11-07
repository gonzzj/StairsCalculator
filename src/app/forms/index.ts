import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {StairsComponent} from './stairs';
import {TechnicalDataComponent} from './technical-data';
import {StairsEscComponent} from './stairs-esc';
import {StairsKitComponent} from './stairs-kit';
import {StairsMeasureComponent} from './stairs-measure';
import {ServicesComponent} from './services';
import {TransportComponent} from './transport';
import {ObservationComponent} from './observation';
import {SubTotalComponent} from './subtotal';
import {TotalComponent} from './total';

import {PopulateService} from '../services/PopulateService'

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule
  ],
  declarations: [
    StairsComponent,
    TechnicalDataComponent,
    StairsMeasureComponent,
    StairsEscComponent,
    StairsKitComponent,
    ServicesComponent,
    TransportComponent,
    ObservationComponent,
    SubTotalComponent,
    TotalComponent
  ],
  exports: [
    StairsComponent
  ],
  providers: [PopulateService]
})
export class StairsModule {}
