import { Component, OnInit } from '@angular/core';
import { Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms/src/model';
import { PopulateService } from '../../services/PopulateService';
import { SimpleChanges, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { EventEmitter } from '@angular/common/src/facade/async';
import { CommunicateService } from '../../services/CommunicateService';

@Component({
    selector: 'service-input',
    template: require('./service-input.html')
})

export class ServiceInputComponent implements OnInit, OnChanges {
    @Input('group') serviceInputForm: FormGroup;
    @Input('dataService') dataService: any;
    @Input('dataServiceZones') dataServiceZones: any;
    @Input('index') index: FormGroup;
    @Output() getControlRow: EventEmitter<any> = new EventEmitter<any>();

    priceService: number = 0;
    isSubmit: boolean = false;

    constructor(private populateService: PopulateService, private cs: CommunicateService) {}

    ngOnInit() {
        this.serviceInputForm.valueChanges.subscribe(data => {
            this.calculatePrice(data);
        });

        this.cs.submitted.subscribe(data => this.isSubmit = data);
    }

    ngOnChanges(changes: SimpleChanges) {
        setTimeout(() => {
            //this.priceService = 0;
        });
    }

    calculatePrice(data) {
        if (typeof this.dataService !== 'undefined') {
            for (let service of this.dataService) {
                if (service.id === Number(data.serviceName)) {
                    this.priceService = service.Precio * data.cant;

                    this.serviceInputForm.value['price'] = this.priceService;
                }
            }
        }
    }

    removeRow(i: number, control: string) {
        this.getControlRow.emit({index: i, name: control});
    }
}