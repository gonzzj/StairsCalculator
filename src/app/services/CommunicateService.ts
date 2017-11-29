import {Injectable, EventEmitter} from '@angular/core';
import {stairTypes} from '../constants';
import {extrasTypes} from '../constants';
declare let pdfMake;

@Injectable()

/** Class Communicate forms components */
export class CommunicateService {
  submitted: EventEmitter<boolean> = new EventEmitter<boolean>();
  zohoForm: Array<Object>;
  validForms: Array<Object>;
  isValidForm: boolean = false;

  /**
   * @constructor
   */
  constructor() {
    this.zohoForm = [
      {
        client: [
          {
            name: 'Juan Perez Carreras',
            orderNumber: 3,
            seller: 'Gabriele Brignoli'
          }
        ],
        stairType: '',
        technicalData: [],
        stair: [],
        services: [],
        transport: [],
        extras: [],
        observations: [],
        subTotal: [],
        discount: [],
        total: []
      }
    ];

    this.validForms = [
      {
        technicalData: false,
        stair: false,
        services: true,
        transport: true,
        extras: true
      }
    ];
  }

  /**
   * Send to the child components if the submit button was clicked
   *
   * @param value - the state of the button
   */
  isSubmit(value: boolean) {
    this.submitted.emit(value);
  }

  /**
   * Validate all the child forms components
   *
   * @param validForm - The state of the form validation
   * @param nameForm - the name of the form
   */
  validateForm(validForm: boolean, nameForm: string) {
    this.validForms[0][nameForm] = validForm;

    if (this.validForms[0]['technicalData'] == true && this.validForms[0]['stair'] == true && this.validForms[0]['transport'] == true && this.validForms[0]['services'] == true && this.validForms[0]['extras'] == true) {
      this.isValidForm = true;
    } else {
      this.isValidForm = false;
    }
  }

  /**
   * Add to zoho form the JSON part of the child component
   *
   * @param form - The JSON of the child component
   * @param nameForm - the name of the form
   */
  addZoho(form, nameForm) {
    this.zohoForm[0][nameForm] = form;
  }

  /**
   * Send to zoho the complete JSON
   */
  sendZoho(stairType) {
    if (stairType == "measure") {
      this.zohoForm[0]['stairType'] = stairTypes.measure;
    } else if (stairType == "kit") {
      this.zohoForm[0]['stairType'] = stairTypes.kit;
    } else {
      this.zohoForm[0]['stairType'] = stairTypes.esc;
    }
    console.log(JSON.stringify(this.zohoForm, null, 2));

    console.log('Se envio');
  }

  /**
   * Ask for the validation and if it is correct, it will create the PDF to print
   */
  savePDF(stairType) {
    var date = new Date();
    var today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

    if (this.isValidForm == true) {
      var stair = this.getStairMail(stairType);

      var accessories = [];
      accessories.push([{text: 'Cant', style: 'tableHeaderCenter'}, {text: 'Accesorio', style: 'tableHeader'}, {text: 'Precio', style: 'tableHeaderCenter'}]);
      for (var accessorie of this.zohoForm[0]['stair']['accessories']) {
        accessories.push([{text: accessorie.cant.toString(), style: 'tableTextCenter'}, {text: accessorie.accessorieName, style: 'tableText'}, {text: this.formatPrice(accessorie.price) + ' €', style: 'tableTextCenter', bold: true}]);
      }

      var services = [];
      services.push([{text: 'Cant', style: 'tableHeaderCenter'}, {text: 'Zona', style: 'tableHeaderCenter'}, {text: 'Concepto', style: 'tableHeaderCenter'}]);
      for (var service of this.zohoForm[0]['services']) {
        services.push([{text: service.cant.toString(), style: 'tableTextCenter'}, {text: service.zone, style: 'tableTextCenter'}, {text: service.serviceName, style: 'tableTextCenter'}]);
      }

      var transports = [];
      transports.push([{text: 'Cant', style: 'tableHeaderCenter'}, {text: 'Zona', style: 'tableHeader'}]);
      for (var transport of this.zohoForm[0]['transport']) {
        transports.push([{text: transport.cant.toString(), style: 'tableTextCenter'}, {text: transport.zoneName, style: 'tableText'}])
      }

      var extras = [];
      var extraType;
      extras.push([{text: 'Cant', style: 'tableHeaderCenter'}, {text: 'Concepto', style: 'tableHeaderCenter'}, {text: 'Atribuir', style: 'tableHeaderCenter'}, {text: 'Precio', style: 'tableHeaderCenter'}]);
      for (var extra of this.zohoForm[0]['extras']) {
        if (extra.type == 'stair') {
          extraType = extrasTypes.stair;
        } else if (extra.type == 'transport') {
          extraType = extrasTypes.transport;
        } else if (extra.type == 'service') {
          extraType = extrasTypes.service;
        } else {
          extraType = extrasTypes.extras;
        }
        extras.push([{text: extra.cant.toString(), style: 'tableTextCenter'}, {text: extra.extraName, style: 'tableTextCenter'}, {text: extraType, style: 'tableTextCenter'}, {text: this.formatPrice(extra.price) + ' €', style: 'tableTextCenter', bold: true}])
      }

      if (!this.zohoForm[0]['observations']) {
        this.zohoForm[0]['observations'] = "Sin comentarios";
      }

      var docDefinition = {
        content: [
          {
            image: 'data:image/png;base64,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',
            width: 220
          },
          {
            text: 'Cliente: Juan Perez Carreras',
            style: 'headers',
            fontSize: 16
          },
          {
            text: [
              'Pedido Nro: ',
              {text: '3', style: 'strong'},
              ' - Cotizador: ',
              {text: 'Gabriele Brignoli', style: 'strong'},
            ],
            style: 'row'
          },
          {
            text: [
              'Fecha: ',
              {text: today, style: 'strong'}
            ],
            fontSize: 9
          },
          {
            text: 'Datos técnicos informativos',
            style: 'headers'
          },
          {
            text: [
              'Configuración: ',
              {text: this.zohoForm[0]['technicalData'].config, style: 'strong'}
            ],
            style: 'row'
          },
          {
            columns: [
              {
                text: 'Nro peld:',
                style: 'row'
              },
              {
                text: this.zohoForm[0]['technicalData'].cantTreads.toString(),
                style: 'strong'
              },
              {
                text: 'Altura peld:',
                style: 'row'
              },
              {
                text: this.zohoForm[0]['technicalData'].heightTreads + ' cm',
                style: 'strong'
              },
              {
                text: 'Ancho peld:',
                style: 'row'
              },
              {
                text: this.zohoForm[0]['technicalData'].widthTreads + ' cm',
                style: 'strong'
              },
              {
                text: 'Diametro:',
                style: 'row'
              },
              {
                text: this.zohoForm[0]['technicalData'].diameter + ' cm',
                style: 'strong'
              }
            ]
          },
          {
            columns: [
              {
                text: 'Altura total cm:',
                style: 'row'
              },
              {
                text: this.zohoForm[0]['technicalData'].heightTotal + ' cm',
                style: 'strong'
              },
              {
                text: 'Altura suelo/techo cm:',
                style: 'row'
              },
              {
                text: this.zohoForm[0]['technicalData'].heightGround + ' cm',
                style: 'strong'
              }
            ]
          },
          {
            columns: [
              {
                text: 'Altura hueco cm:',
                style: 'row'
              },
              {
                text: this.zohoForm[0]['technicalData'].heightHole + ' cm',
                style: 'strong'
              },
              {
                text: 'Largo hueco cm:',
                style: 'row'
              },
              {
                text: this.zohoForm[0]['technicalData'].longHole + ' cm',
                style: 'strong'
              }
            ]
          },
          stair,
          {
            text: 'Accesorios',
            style: 'headers'
          },
          {
            table: {
              widths: [35, '*', 75],
              headerRows: 1,
              body: accessories
            },
            layout: 'headerLineOnly',
            pageBreak: 'after'
          },
          {
            columns: [
              {
                text: 'Montaje',
                style: 'headers'
              },
              {
                text: 'Transporte',
                style: 'headers'
              }
            ]
          },
          {
            columns: [
              {
                table: {
                  widths: [35, '*', '*'],
                  headerRows: 1,
                  body: services
                },
                layout: 'headerLineOnly',
                margin: [0, 0, 14, 0]
              },
              {
                table: {
                  widths: [35, '*'],
                  headerRows: 1,
                  body: transports
                },
                layout: 'headerLineOnly'
              }
            ]
          },
          {
            columns: [
              {
                text: 'Adicionales',
                style: 'headers'
              },
              {
                text: 'Subtotal',
                style: 'headers'
              }
            ]
          },
          {
            columns: [
              {
                table: {
                  widths: [35, '*', '*', 75],
                  headerRows: 1,
                  body: extras
                },
                layout: 'headerLineOnly',
                margin: [0, 0, 14, 0]
              },
              {
                table: {
                  widths: ['*', 35, 100],
                  headerRows: 1,
                  body: [
                    [{text: 'Concepto', style: 'tableHeader'}, {text: 'Desc', style: 'tableHeaderCenter'}, {
                      text: 'Importe',
                      style: 'tableHeaderCenter'
                    }],
                    [{text: 'Total material', style: 'tableText'}, {
                      text: '-',
                      style: 'tableTextCenter'
                    }, {text: this.formatPrice(this.zohoForm[0]['subTotal'][0]['stair']) + ' €', style: 'tableTextCenter', bold: true}],
                    [{text: 'Descuento material', style: 'tableText'}, {
                      text: this.zohoForm[0]['discount'][0]['discount'],
                      style: 'tableTextCenter'
                    }, {text: this.formatPrice(this.zohoForm[0]['discount'][0]['value']) + ' €', style: 'tableTextCenter', bold: true}],
                    [{text: 'Transporte', style: 'tableText'}, {
                      text: '-',
                      style: 'tableTextCenter'
                    }, {text: this.formatPrice(this.zohoForm[0]['subTotal'][0]['transport']) + ' €', style: 'tableTextCenter', bold: true}],
                    [{text: 'Montaje', style: 'tableText'}, {
                      text: '-',
                      style: 'tableTextCenter'
                    }, {text: this.formatPrice(this.zohoForm[0]['subTotal'][0]['service']) + ' €', style: 'tableTextCenter', bold: true}],
                    [{text: 'Adicionales', style: 'tableText'}, {
                      text: '-',
                      style: 'tableTextCenter'
                    }, {text: this.formatPrice(this.zohoForm[0]['subTotal'][0]['extras']) + ' €', style: 'tableTextCenter', bold: true}],
                  ]
                },
                layout: 'headerLineOnly'
              }
            ]
          },
          {
            text: 'Observaciones',
            style: 'headers'
          },
          {
            text: this.zohoForm[0]['observations'],
            fontSize: 9
          },
          {
            text: 'Total: ' + this.formatPrice(this.zohoForm[0]['total']) + ' €',
            style: 'strong',
            fontSize: 20,
            alignment: 'right',
            margin: [0, 12, 0, 0]
          },
        ],
        styles: {
          headers: {
            fontSize: 12,
            bold: true,
            margin: [0, 12, 0, 8]
          },
          strong: {
            bold: true,
            fontSize: 9
          },
          row: {
            margin: [0, 0, 0, 6],
            fontSize: 9
          },
          tableHeader: {
            bold: true,
            fontSize: 9,
            color: 'black',
            margin: [0, 0, 0, 4]
          },
          tableHeaderCenter: {
            bold: true,
            fontSize: 9,
            color: 'black',
            margin: [0, 0, 0, 4],
            alignment: 'center'
          },
          tableText: {
            fontSize: 9,
            margin: [0, 4, 0, 0]
          },
          tableTextCenter: {
            fontSize: 9,
            alignment: 'center',
            margin: [0, 4, 0, 0]
          }
        }
      };

      pdfMake.createPdf(docDefinition).download(today + '-Juan_Perez_Carreras' + '.pdf');
    } else {
      window.scrollTo(0, 0);
    }
  }

  /**
   * Get the part of the stair JSON to print the PDF
   *
   * @param stairType - The type of the stair
   * @return {Array} part of the stair JSON to the PDF
   */
  getStairMail(stairType) {
    var stair;
    var stairTypeName;
    var guardrail = [];


    if (stairType == 'measure') {
      if (this.zohoForm[0]['stair']['guardrail']['activeGuardrail'] == true) {
        guardrail = [
          'Metros: ',
          {text: this.zohoForm[0]['stair']['guardrail']['measure'] + ' cm', style: 'strong'},
          '\n\nModelo: ',
          {text: this.zohoForm[0]['stair']['guardrail']['model'], style: 'strong'},
          {text: '\n\nConfiguración recta:', style: 'strong'},
          '\n\n- Cantidad: ',
          {text: this.zohoForm[0]['stair']['guardrail']['cantStraight'].toString() + "  -  0,00 €", style: 'strong'},
          {text: '\n\nConfiguración curva:', style: 'strong'},
          '\n\n- Cantidad: ',
          {text: this.zohoForm[0]['stair']['guardrail']['cantCurve'].toString() + "  -  0,00 €", style: 'strong'},
          '\n\n- Acabado: ',
          {text: this.zohoForm[0]['stair']['guardrail']['finish'], style: 'strong'},
          '\n\n- Pasamano: ',
          {text: this.zohoForm[0]['stair']['guardrail']['railing'], style: 'strong'},
        ]
      }

      stairTypeName = stairTypes.measure;

      var treads = [];
      treads.push([{ text: 'Cant', style: 'tableHeaderCenter' }, { text: 'Tipo peldaño', style: 'tableHeaderCenter'}, { text: 'Ancho', style: 'tableHeaderCenter' }, { text: 'Acabado', style: 'tableHeaderCenter' }, { text: 'Precio', style: 'tableHeaderCenter' }]);
      for (var tread of this.zohoForm[0]['stair']['treads']) {
        treads.push([{ text: tread.cant.toString(), style: 'tableTextCenter' }, { text: tread.treadName, style: 'tableTextCenter' }, { text:  tread.measure, style: 'tableTextCenter' }, { text: tread.treadFinish, style: 'tableTextCenter' }, { text:  this.formatPrice(tread.price) + ' €', style: 'tableTextCenter', bold: true }]);
      }

      stair = [
        {
          text: stairTypeName,
          style: 'headers'
        },
        {
          columns: [
            {
              text: [
                'Cantidad escaleras: ',
                { text: this.zohoForm[0]['stair']['cant'].toString(), style: 'strong' }
              ],
              fontSize: 9
            },
            {
              text: [
                'Modelo escalera: ',
                { text: this.zohoForm[0]['stair']['model'], style: 'strong' }
              ],
              fontSize: 9
            }
          ]
        },
        {
          text: 'Estructura',
          style: 'headers'
        },
        {
          text: [
            'Tipo estructura: ',
            { text: this.zohoForm[0]['stair']['structure']['type'], style: 'strong' }
          ],
          style: 'row'
        },
        {
          text: [
            'Acabado estructura: ',
            { text: this.zohoForm[0]['stair']['structure']['finish'], style: 'strong' }
          ],
          style: 'row'
        },
        {
          text: 'Peldaños y Contrahuellas',
          style: 'headers'
        },
        {
          table: {
            widths: [35, '*', '*', '*', 75],
            headerRows: 1,
            body: treads
          },
          layout: 'headerLineOnly'
        },
        {
          columns: [
            {
              text: 'Barandilla escalera',
              style: 'headers'
            },
            {
              text: 'Baranda de protección',
              style: 'headers'
            }
          ]
        },
        {
          columns: [
            {
              text: [
                'Modelo: ',
                {text: this.zohoForm[0]['stair']['railing']['model'], style: 'strong'},
                {text: '\n\nConfiguración recta:', style: 'strong'},
                '\n\n- Cantidad: ',
                {text: this.zohoForm[0]['stair']['railing']['cantStraight'].toString() + "  -  0,00 €", style: 'strong'},
                {text: '\n\nConfiguración curva:', style: 'strong'},
                '\n\n- Cantidad: ',
                {text: this.zohoForm[0]['stair']['railing']['cantCurve'].toString() + "  -  0,00 €", style: 'strong'},
                '\n\n- Acabado: ',
                {text: this.zohoForm[0]['stair']['railing']['finish'], style: 'strong'},
                '\n\n- Pasamano: ',
                {text: this.zohoForm[0]['stair']['railing']['railing'], style: 'strong'},
              ],
              style: 'row'
            },
            {
              text: guardrail,
              style: 'row'
            },
          ]
        }];

    } else if (stairType == 'esc') {
      stairTypeName = stairTypes.esc;

      stair = [
        {
          text: stairTypeName,
          style: 'headers'
        },
        {
          text: [
            'Modelo escalera: ',
            { text: this.zohoForm[0]['stair']['model'], style: 'strong' }
          ],
          style: 'row'
        },
        {
          text: 'Datos técnicos',
          style: 'headers'
        },
        {
          text: [
            'Medida: ',
            { text: this.zohoForm[0]['stair']['measure'] + ' cm', style: 'strong' }
          ],
          style: 'row'
        }];
    } else {
      stairTypeName = stairTypes.kit;

      stair = [
        {
          text: stairTypeName,
          style: 'headers'
        },
        {
          text: [
            'Modelo escalera: ',
            { text: this.zohoForm[0]['stair']['model'], style: 'strong' }
          ],
          style: 'row'
        },
        {
          text: [
            'Diametro: ',
            { text: this.zohoForm[0]['stair']['diameter'] + ' cm', style: 'strong' }
          ],
          style: 'row'
        },
        {
          text: 'Datos técnicos',
          style: 'headers'
        },
        {
          text: [
            'Medida: ',
            { text: this.zohoForm[0]['stair']['measure'] + ' cm', style: 'strong' }
          ],
          style: 'row'
        }];
    }

    return stair;
  }

  formatPrice(value) {
    var coin: string;

    coin = value.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");

    return coin;
  }
}

