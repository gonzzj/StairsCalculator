import { Component, OnInit } from '@angular/core';
import { Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms/src/model';
import { PopulateService } from '../../services/PopulateService';
import { SimpleChanges, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { EventEmitter } from '@angular/common/src/facade/async';
import { CommunicateService } from '../../services/CommunicateService';
import { formErrors } from '../../constants';

@Component({
    selector: 'structure-input',
    template: require('./structure-input.html')
})

export class StructureInputComponent implements OnInit, OnChanges {
    @Input('group') structureInputForm: FormGroup;
    @Input('dataStructure') dataStructure: FormGroup;
    @Input('index') index: FormGroup;
    @Output() getControlRow: EventEmitter<any> = new EventEmitter<any>();

    emptyField = formErrors.message_emptyField;
    populateStructureFinish: any;
    priceStructure: number = 0;
    isSubmit: boolean = false;

    constructor(private populateService: PopulateService, private cs: CommunicateService) {}

    ngOnInit() {
        this.structureInputForm.valueChanges.subscribe(data => {
            this.calculatePrice(data);
        });

        this.cs.submitted.subscribe(data => this.isSubmit = data);
    }

    ngOnChanges(changes: SimpleChanges) {
        setTimeout(() => {
            this.priceStructure = 0;
            this.populateStructureFinish = undefined;
            this.structureInputForm.controls['finish'].disable();
        });
    }

    loadStructureData(e) {
        let arrayFinish = [];
        this.structureInputForm.controls['finish'].disable();
        this.priceStructure = 0;

        this.populateService.getStructureFinish(e.target.value).subscribe(data => {
            if (typeof data.length === 'undefined') {
                arrayFinish.push(data);
                this.populateStructureFinish = arrayFinish;
            } else {
                this.populateStructureFinish = data;
            }

            this.structureInputForm.controls['finish'].enable();
        });
    }

    calculatePrice(data) {
        if (typeof this.populateStructureFinish !== 'undefined') {
            for (let structure of this.populateStructureFinish) {
                if (structure.id === Number(data.finish)) {
                    this.priceStructure = structure.Precio * data.cant;

                    this.structureInputForm.value['price'] = this.priceStructure;
                }
            }
        }
    }

    removeRow(i: number, control: string) {
        this.getControlRow.emit({index: i, name: control});
    }
}