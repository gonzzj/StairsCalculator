import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { FormGroup } from '@angular/forms/src/model';
import { PopulateService } from '../../services/PopulateService';
import { SimpleChanges, OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'structure-input',
    template: require('./structure-input.html')
})

export class StructureInputComponent implements OnInit, OnChanges {
    @Input('group') structureInputForm: FormGroup;
    @Input('dataStructure') dataStructure: FormGroup;
    @Input('index') index: FormGroup;
    populateStructureFinish: any;
    priceStructure: number = 0;

    constructor(private populateService: PopulateService) {}

    ngOnInit() {
        this.structureInputForm.valueChanges.subscribe(data => {
            this.calculatePrice(data);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        this.priceStructure = 0;
        this.populateStructureFinish = undefined;
    }

    loadDataStructure(e) {
        let arrayFinish = [];
        this.structureInputForm.controls['finish'].disable();

        this.populateService.getStructureFinish(e.target.value).subscribe(data => {
            if (typeof data.length === 'undefined') {
                arrayFinish.push(data);
                this.populateStructureFinish = arrayFinish;
            } else {
                this.populateStructureFinish = data;
            }

            this.priceStructure = 0;
            this.structureInputForm.controls['finish'].enable();
        });
    }

    calculatePrice(data) {
        if (typeof this.populateStructureFinish !== 'undefined') {
            for (var structure of this.populateStructureFinish) {
                if (structure.id === Number(data.finish)) {
                    this.priceStructure = structure.Precio * data.cant;

                    this.structureInputForm.value['price'] = this.priceStructure;
                }
            }
        }
    }

    removeRow(i: number) {
        // @TODO Probar recibir todo el stairForm para borrar el index...
    }
}