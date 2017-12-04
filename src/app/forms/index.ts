import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Ng2CompleterModule} from 'ng2-completer';

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
import {ExtrasComponent} from './extras';
import {FormatPricePipe} from '../pipes/formatprice';

import {PopulateService} from '../services/PopulateService'
import {CommunicateService} from '../services/CommunicateService'
import { StructureInputComponent } from './structure-input/structure-input';
import { TreadInputComponent } from './tread-input/tread-input';
import { RailingFormComponent } from './railing/railing';
import { GuardrailFormComponent } from './guardrail/guardrail';
import { ServiceInputComponent } from './service-input/service-input';
import { TransportInputComponent } from './transport-input/transport-input';
import { ModalLoadingComponent } from './modal-loading/modal-loading';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2CompleterModule
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
    TotalComponent,
    ExtrasComponent,
    FormatPricePipe,
    StructureInputComponent,
    TreadInputComponent,
    RailingFormComponent,
    GuardrailFormComponent,
    ServiceInputComponent,
    TransportInputComponent,
    ModalLoadingComponent
  ],
  exports: [
    StairsComponent
  ],
  providers: [
    PopulateService,
    CommunicateService
  ]
})
export class StairsModule {}
