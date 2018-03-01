import { Component, OnInit } from '@angular/core';
import { Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms/src/model';
import { PopulateService } from '../../services/PopulateService';
import { SimpleChanges, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { CommunicateService } from '../../services/CommunicateService';
import { formErrors } from '../../constants';

@Component({
    selector: 'railing-form',
    template: require('./railing.html')
})

export class RailingFormComponent implements OnInit, OnChanges {
    @Input('group') railingForm: FormGroup;
    @Input('dataRailing') dataRailing: FormGroup;

    emptyField = formErrors.message_emptyField;
    populateRailing: any;
    populateRailingFinish: any;
    priceRailingStraight: number = 0;
    priceRailingCurve: number = 0;
    isSubmit: boolean = false;

    constructor(private populateService: PopulateService, private cs: CommunicateService) {}

    ngOnInit() {
        this.railingForm.valueChanges.subscribe(data => {
            this.calculatePrice(data);
        });

        this.cs.submitted.subscribe(data => this.isSubmit = data);
    }

    ngOnChanges(changes: SimpleChanges) {
        setTimeout(() => {
            this.priceRailingStraight = 0;
            this.priceRailingCurve = 0;

            this.populateRailing = undefined;
            this.populateRailingFinish = undefined;
            this.railingForm.controls['railing'].disable();
            this.railingForm.controls['finish'].disable();
        });
    }

    loadRailingData(e) {
        let arrayRailing = [];
        this.railingForm.controls['railing'].disable();
        this.railingForm.controls['finish'].disable();
        this.priceRailingStraight = 0;
        this.priceRailingCurve = 0;

        this.populateService.getRailing(e.target.value).subscribe(data => {
            if (typeof data.length === 'undefined') {
                arrayRailing.push(data);
                this.populateRailing = arrayRailing;
            } else {
                this.populateRailing = data;
            }

            this.railingForm.controls['railing'].enable();
        });
    }

    loadRailingFinishData(e) {
        this.railingForm.controls['finish'].disable();
        this.priceRailingStraight = 0;
        this.priceRailingCurve = 0;

        this.populateService.getRailingFinish(e.target.value).subscribe(data => {
            this.populateRailingFinish = data;
            
            this.railingForm.controls['finish'].enable();
        });
    }

    calculatePrice(data) {
        if (typeof this.populateRailingFinish !== 'undefined') {
            for (var railingFinish of this.populateRailingFinish) {
                if (railingFinish.id === Number(data.finish)) {
                    this.priceRailingStraight = railingFinish['Precio metro recta'] * data.cantStraight;
                    this.priceRailingCurve = railingFinish['Precio metro curva'] * data.cantCurve;

                    this.railingForm.value['priceStraight'] = this.priceRailingStraight;
                    this.railingForm.value['priceCurve'] = this.priceRailingCurve;
                }
            }
        }
    }
}