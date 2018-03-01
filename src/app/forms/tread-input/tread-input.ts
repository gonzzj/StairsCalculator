import { Component, OnInit } from '@angular/core';
import { Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms/src/model';
import { PopulateService } from '../../services/PopulateService';
import { SimpleChanges, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { EventEmitter } from '@angular/common/src/facade/async';
import { CommunicateService } from '../../services/CommunicateService';
import { formErrors } from '../../constants';

@Component({
    selector: 'tread-input',
    template: require('./tread-input.html')
})

export class TreadInputComponent implements OnInit, OnChanges {
    @Input('group') treadInputForm: FormGroup;
    @Input('dataTread') dataTread: FormGroup;
    @Input('index') index: FormGroup;
    @Output() getControlRow: EventEmitter<any> = new EventEmitter<any>();

    emptyField = formErrors.message_emptyField;
    populateTreadFinish: any;
    populateTreadMeasure: any;
    priceTread: number = 0;
    isSubmit: boolean = false;

    constructor(private populateService: PopulateService, private cs: CommunicateService) {}

    ngOnInit() {
        this.treadInputForm.valueChanges.subscribe(data => {
            this.calculatePrice(data);
        });

        this.cs.submitted.subscribe(data => this.isSubmit = data);
    }

    ngOnChanges(changes: SimpleChanges) {
        setTimeout(() => {
            this.priceTread = 0;
            this.populateTreadFinish = undefined;
            this.populateTreadMeasure = undefined;
            this.treadInputForm.controls['treadFinish'].disable();
            this.treadInputForm.controls['measure'].disable();
        });
    }

    loadTreadFinishData(e) {
        let arrayFinish = [];
        this.treadInputForm.controls['treadFinish'].disable();
        this.treadInputForm.controls['measure'].disable();
        this.priceTread = 0;

        this.populateService.getTreadFinish(e.target.value).subscribe(data => {
            if (typeof data.length === 'undefined') {
                arrayFinish.push(data);
                this.populateTreadFinish = arrayFinish;
            } else {
                this.populateTreadFinish = data;
            }

            this.treadInputForm.controls['treadFinish'].enable();
        });
    }

    loadMeasureData(e) {
        this.treadInputForm.controls['measure'].disable();
        this.priceTread = 0;

        this.populateService.getTreadMeasure(e.target.value).subscribe(data => {
            this.populateTreadMeasure = data;
            this.treadInputForm.controls['measure'].enable();
        });
    }

    calculatePrice(data) {
        if (typeof this.populateTreadMeasure !== 'undefined') {
            for (var treadMeasure of this.populateTreadMeasure) {
                if (treadMeasure.id === Number(data.measure)) {
                    this.priceTread = treadMeasure.Precio * data.cant;

                    this.treadInputForm.value['price'] = this.priceTread;
                }
            }
        }
    }

    removeRow(i: number, control: string) {
        this.getControlRow.emit({index: i, name: control});
    }
}