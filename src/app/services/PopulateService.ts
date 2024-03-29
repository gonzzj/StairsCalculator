import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';

@Injectable()
export class PopulateService {

  constructor(private http: Http) {}

  getModels(stairType: any) {
    let url: string;

    if (stairType === 'measure') {
      url = 'http://admin.proclen.com/rest/escaleras-medida/modelos/';
    } else if (stairType === 'kit') {
      url = 'http://admin.proclen.com/rest/escaleras-kit/modelos/';
    } else {
      url = 'http://admin.proclen.com/rest/escaleras-escamoteables/modelos/';
    }

    return this.http.get(url)
    .map((res => res.json()));
  }

  getTreadName(idModel: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-medida/peldanios-contrahuellas/?idEscaleraMedida=' + idModel)
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
    return this.http.get('http://admin.proclen.com/rest/escaleras-medida/acabados-estructuras/?idEscalerasMedidaEstructuraTipo=' + idStructure)
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

  getAccessories(stairType: string, idModel: number) {
    let url: string;

    if (stairType === 'measure') {
      url = 'http://admin.proclen.com/rest/escaleras-medida/accesorios/?idEscaleraMedida=';
    } else if (stairType === 'kit') {
      url = 'http://admin.proclen.com/rest/escaleras-kit/accesorios/?idEscaleraKit=';
    } else {
      url = 'http://admin.proclen.com/rest/escaleras-escamoteables/accesorios/?idEscaleraEscamoteable=';
    }

    return this.http.get(url + idModel)
    .map((res => res.json()));
  }

  getServices(stairData: any) {
    let url: string;

    if (stairData[0]['stairType'] === 'measure') {
      url = 'http://admin.proclen.com/rest/escaleras-medida/tipos-montajes/?idEscaleraMedida=';
    } else if (stairData[0]['stairType'] === 'kit') {
      url = 'http://admin.proclen.com/rest/escaleras-kit/tipos-montajes/?idEscaleraKit=';
    } else {
      url = 'http://admin.proclen.com/rest/escaleras-escamoteables/tipos-montajes/?idEscaleraEscamoteable=';
    }

    return this.http.get(url + stairData[0]['stairModelId'])
    .map((res => res.json()));
  }

  getServicesZones() {
    return this.http.get('http://admin.proclen.com/rest/zonas-montajes/')
    .map((res => res.json()));
  }

  getTransportPrices(stairData: any) {
    let url: string;

    if (stairData[0]['stairType'] === 'measure') {
      url = 'http://admin.proclen.com/rest/escaleras-medida/transportes/?idEscaleraMedida=';
    } else if (stairData[0]['stairType'] === 'kit') {
      url = 'http://admin.proclen.com/rest/escaleras-kit/transportes/?idEscaleraKit=';
    } else {
      url = 'http://admin.proclen.com/rest/escaleras-escamoteables/transportes/?idEscaleraEscamoteable=';
    }

    return this.http.get(url + stairData[0]['stairModelId'])
    .map((res => res.json()));
  }

  getTransportZones() {
    return this.http.get('http://admin.proclen.com/rest/zonas-transportes/')
    .map((res => res.json()));
  }

  getKitDiameters(idModel: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-kit/diametros/?idEscaleraKit=' + idModel)
    .map((res => res.json()));
  }

  getKitDiameterMeasures(idKitDiameter: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-kit/medidas-diametros/?idEscaleraKitDiametro=' + idKitDiameter)
    .map((res => res.json()));
  }

  getEscMeasures(idModel: number) {
    return this.http.get('http://admin.proclen.com/rest/escaleras-escamoteables/tamanios/?idEscaleraEscamoteable=' + idModel)
    .map((res => res.json()));
  }
}
