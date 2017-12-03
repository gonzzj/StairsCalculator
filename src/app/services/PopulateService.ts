import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';

@Injectable()
export class PopulateService {
  private dataKitModels: any;
  private dataEscModels: any;
  private dataTreadFinish: any;
  private dataMeasure: any;
  private dataAccessories: any;
  private dataModelsRailing: any;
  private dataZones: any;
  private dataServices: any;
  private dataDiamaterKit: any;

  constructor(private http: Http) {}

  getMeasureModels() {
    return this.http.get('http://admin.proclen.com/rest/escaleras-medida/modelos/')
    .map((res => res.json()));
  }

  getTreadName(idModel: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-medida/peldanios-contrahuellas/?idEscalerasMedidaPeldano=' + idModel)
    .map((res => res.json()));
  }

  getTreadFinish(idTread: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-medida/acabados-peldanios-contrahuellas/?idEscalerasMedidaPeldano=' + idTread)
    .map((res => res.json()));
  }

  getTreadMeasure(idTreadFinish: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-medida/anchos-peldanios-contrahuellas/?idEscalerasMedidasPeldanosAcabado=' + idTreadFinish)
    .map((res => res.json()));
  }

  getStructure(idModel: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-medida/estructuras-tipo/?idEscaleraMedida=' + idModel)
    .map((res => res.json()));
  }

  getStructureFinish(idStructure: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-medida/acabados-estructuras/' + idStructure)
    .map((res => res.json()));
  }

  getRailingModels(idModel: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-medida/barandillas/?idEscaleraMedida=' + idModel)
    .map((res => res.json()));
  }

  getRailing(idRailingModel: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-medida/pasamanos-barandillas/?idEscaleraMedidaBarandaPasamano=' + idRailingModel)
    .map((res => res.json()));
  }

  getRailingFinish(idRailing: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-medida/acabados-barandillas/?idEscalerasMedidaBarandillaPasamano=' + idRailing)
    .map((res => res.json()));
  }

  getGuardrailModels(idModel: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-medida/barandas/?idEscaleraMedida=' + idModel)
    .map((res => res.json()));
  }

  getGuardrail(idGuardrailModel: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-medida/pasamanos-barandas/?idEscaleraMedidaBaranda=' + idGuardrailModel)
    .map((res => res.json()));
  }

  getGuardrailFinish(idGuardrail: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-medida/acabados-barandas/?idEscaleraMedidaBarandaPasamano=' + idGuardrail)
    .map((res => res.json()));
  }

  getAccessories() {
    if (this.dataAccessories) {
      return Promise.resolve(this.dataAccessories);
    }

    return new Promise(resolve => {
      this.http.get('http://loscillo.com/enesca/mockv2/getAccesories.php')
        .map(res => res.json())
        .subscribe(data => {
          this.dataAccessories = data;
          resolve(this.dataAccessories);
        }, (error) => {
          console.log('Error');
        })
    });
  }

  getServices() {
    if (this.dataServices) {
      return Promise.resolve(this.dataServices);
    }

    return new Promise(resolve => {
      this.http.get('http://enesca.polarbeardevelopment.com/mock/getServices.php')
        .map(res => res.json())
        .subscribe(data => {
          this.dataServices = data.collection.items[0].data;
          resolve(this.dataServices);
        }, (error) => {
          console.log('Error');
        })
    });
  }

  getZones() {
    if (this.dataZones) {
      return Promise.resolve(this.dataZones);
    }

    return new Promise(resolve => {
      this.http.get('http://enesca.polarbeardevelopment.com/mock/getZones.php')
        .map(res => res.json())
        .subscribe(data => {
          this.dataZones = data.collection.items[0].data;
          resolve(this.dataZones);
        }, (error) => {
          console.log('Error');
        })
    });
  }

  getKitModels() {

    if (this.dataKitModels) {
      return Promise.resolve(this.dataKitModels);
    }

    return new Promise(resolve => {
      this.http.get('http://admin.proclen.com/rest/escaleras-kit/modelos/')
        .map(res => res.json())
        .subscribe(data => {
          this.dataKitModels = data;
          resolve(this.dataKitModels);
        }, (error) => {
          console.log('Error');
        })
    });
  }

  getDiameterKit(idModel) {
    if (this.dataDiamaterKit) {
      return Promise.resolve(this.dataDiamaterKit);
    }

    return new Promise(resolve => {
      this.http.get('http://admin.proclen.com/rest/escaleras-kit/diametros/?idEscaleraKit=' + idModel)
        .map(res => res.json())
        .subscribe(data => {
          this.dataDiamaterKit = data;
          resolve(this.dataDiamaterKit);
        }, (error) => {
          console.log('Error');
        })
    });
  }

  getEscModels() {

    if (this.dataEscModels) {
      return Promise.resolve(this.dataEscModels);
    }

    return new Promise(resolve => {
      this.http.get('http://admin.proclen.com/rest/escaleras-escamoteables/modelos/')
        .map(res => res.json())
        .subscribe(data => {
          this.dataEscModels = data;
          resolve(this.dataEscModels);
        }, (error) => {
          console.log('Error');
        })
    });
  }
}