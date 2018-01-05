import { Component, OnInit } from '@angular/core';
import { Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms/src/model';
import { PopulateService } from '../../services/PopulateService';
import { SimpleChanges, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { CommunicateService } from '../../services/CommunicateService';

@Component({
    selector: 'guardrail-form',
    template: require('./guardrail.html')
})

export class GuardrailFormComponent implements OnInit, OnChanges {
    @Input('group') guardrailForm: FormGroup;
    @Input('dataGuardrail') dataGuardrail: FormGroup;
    @Input('stairModel') stairModel: FormGroup;
    
    populateGuardrail: any;
    populateGuardrailFinish: any;
    priceGuardrailStraight: number = 0;
    priceGuardrailCurve: number = 0;
    isSubmit: boolean = false;

    constructor(private populateService: PopulateService, private cs: CommunicateService) {}

    ngOnInit() {
        this.guardrailForm.valueChanges.subscribe(data => {
            this.calculatePrice(data);
        });

        this.cs.submitted.subscribe(data => this.isSubmit = data);
    }

    ngOnChanges(changes: SimpleChanges) {
        setTimeout(() => {
            this.priceGuardrailStraight = 0;
            this.priceGuardrailCurve = 0;

            this.populateGuardrail = undefined;
            this.populateGuardrailFinish = undefined;
            this.guardrailForm.controls['railing'].disable();
            this.guardrailForm.controls['finish'].disable();

            if (!this.guardrailForm.controls['activeGuardrail'].value) {
                this.guardrailForm.controls['model'].disable();
            }
        });
    }

    loadGuardrailData(e) {
        let arrayRailing = [];
        this.guardrailForm.controls['railing'].disable();
        this.guardrailForm.controls['finish'].disable();
        this.priceGuardrailStraight = 0;
        this.priceGuardrailCurve = 0;

        this.populateService.getGuardrail(e.target.value).subscribe(data => {
            if (typeof data.length === 'undefined') {
                arrayRailing.push(data);
                this.populateGuardrail = arrayRailing;
            } else {
                this.populateGuardrail = data;
            }

            this.guardrailForm.controls['railing'].enable();
        });
    }

    loadGuardrailFinishData(e) {
        this.guardrailForm.controls['finish'].disable();
        this.priceGuardrailStraight = 0;
        this.priceGuardrailCurve = 0;

        this.populateService.getGuardrailFinish(e.target.value).subscribe(data => {
            this.populateGuardrailFinish = data;

            this.guardrailForm.controls['finish'].enable();
            this.guardrailForm.controls['cantStraight'].enable();
            this.guardrailForm.controls['cantCurve'].enable();
        });
    }

    calculatePrice(data) {
        if (typeof this.populateGuardrailFinish !== 'undefined' && typeof data.cantStraight !== 'undefined') {
            for (var guardrailFinish of this.populateGuardrailFinish) {
                if (guardrailFinish.id === Number(data.finish)) {
                    this.priceGuardrailStraight = guardrailFinish['Precio metro recta'] * data.cantStraight;
                    this.priceGuardrailCurve = guardrailFinish['Precio metro curva'] * data.cantCurve;

                    this.guardrailForm.value['priceStraight'] = this.priceGuardrailStraight;
                    this.guardrailForm.value['priceCurve'] = this.priceGuardrailCurve;
                }
            }
        }
    }

    /**
     *  Enable or Disable the Guardrail Form
     */
    checkGuardrail(): void {
        if (this.guardrailForm.controls['activeGuardrail'].value) {
            if (this.stairModel.value != '') {
                this.guardrailForm.controls['model'].enable();
            }
        } else {
            this.guardrailForm.controls['model'].disable();
            this.guardrailForm.controls['cantStraight'].disable();
            this.guardrailForm.controls['cantCurve'].disable();
            this.guardrailForm.controls['finish'].disable();
            this.guardrailForm.controls['railing'].disable();

            this.priceGuardrailStraight = 0;
            this.priceGuardrailCurve = 0;
        }
    }
}