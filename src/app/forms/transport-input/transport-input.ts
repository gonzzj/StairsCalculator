import { Component, OnInit } from '@angular/core';
import { Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms/src/model';
import { PopulateService } from '../../services/PopulateService';
import { SimpleChanges, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { EventEmitter } from '@angular/common/src/facade/async';
import { CommunicateService } from '../../services/CommunicateService';
import { formErrors } from '../../constants';

@Component({
    selector: 'transport-input',
    template: require('./transport-input.html')
})

export class TransportInputComponent implements OnInit, OnChanges {
    @Input('group') transportInputForm: FormGroup;
    @Input('dataZones') dataZones: any;
    @Input('index') index: FormGroup;
    @Output() getControlRow: EventEmitter<any> = new EventEmitter<any>();

    emptyField = formErrors.message_emptyField;
    transportZones: any;
    priceTransport: number = 0;
    isSubmit: boolean = false;

    constructor(private populateService: PopulateService, private cs: CommunicateService) {}

    ngOnInit() {
        this.loadZones();

        this.transportInputForm.valueChanges.subscribe(data => {
            this.calculatePrice(data);
        });

        this.cs.submitted.subscribe(data => this.isSubmit = data);
    }

    loadZones() {
        this.populateService.getTransportZones().subscribe(data => this.transportZones = data);
    }

    ngOnChanges(changes: SimpleChanges) {
        setTimeout(() => {
            this.priceTransport = 0;
        });
    }

    calculatePrice(data) {
        if (typeof this.dataZones !== 'undefined') {
            for (let priceZone of this.dataZones) {
                if (priceZone.ZonaId === Number(data.zoneName)) {
                    this.priceTransport = priceZone.Precio * data.cant;

                    this.transportInputForm.value['price'] = this.priceTransport;
                }
            }
        }
    }

    removeRow(i: number, control: string) {
        this.getControlRow.emit({index: i, name: control});
    }
}