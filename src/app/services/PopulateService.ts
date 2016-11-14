import {Http} from "@angular/http";
import 'rxjs/add/operator/map';
import {Injectable} from "@angular/core";

@Injectable()
export class PopulateService {
  private dataModels: any;
  private dataTreadName: any;
  private dataTreadFinish: any;
  private dataMeasure: any;
  private dataStructure: any;
  private dataRiserFinish: any;
  private dataAccessories: any;

  constructor(private http: Http) {}

  getAllModels() {
    if (this.dataModels) {
      return Promise.resolve(this.dataModels);
    }

    return new Promise(resolve => {
      this.http.get('http://enesca.polarbeardevelopment.com/mock/getAllModels.php')
        .map(res => res.json())
        .subscribe(data => {
          this.dataModels = data.collection.items[0].data;
          resolve(this.dataModels);
        }, (error) => {
          console.log('Error');
        })
    });
  }

  getTreadName() {
    if (this.dataTreadName) {
      return Promise.resolve(this.dataTreadName);
    }

    return new Promise(resolve => {
      this.http.get('http://enesca.polarbeardevelopment.com/mock/getTreadsNames.php')
        .map(res => res.json())
        .subscribe(data => {
          this.dataTreadName = data;
          resolve(this.dataTreadName);
        }, (error) => {
          console.log('Error');
        })
    });
  }

  getTreadFinish() {
    if (this.dataTreadFinish) {
      return Promise.resolve(this.dataTreadFinish);
    }

    return new Promise(resolve => {
      this.http.get('http://enesca.polarbeardevelopment.com/mock/getTreadFinish.php')
        .map(res => res.json())
        .subscribe(data => {
          this.dataTreadFinish = data;
          resolve(this.dataTreadFinish);
        }, (error) => {
          console.log('Error');
        })
    });
  }

  getRiserFinish() {
    if (this.dataRiserFinish) {
      return Promise.resolve(this.dataRiserFinish);
    }

    return new Promise(resolve => {
      this.http.get('http://enesca.polarbeardevelopment.com/mock/getRiserFinish.php')
        .map(res => res.json())
        .subscribe(data => {
          this.dataRiserFinish = data;
          resolve(this.dataRiserFinish);
        }, (error) => {
          console.log('Error');
        })
    });
  }

  getMeasure() {
    if (this.dataMeasure) {
      return Promise.resolve(this.dataMeasure);
    }

    return new Promise(resolve => {
      this.http.get('http://enesca.polarbeardevelopment.com/mock/getMeasure.php')
        .map(res => res.json())
        .subscribe(data => {
          this.dataMeasure = data;
          resolve(this.dataMeasure);
        }, (error) => {
          console.log('Error');
        })
    });
  }

  getStructure() {
    if (this.dataStructure) {
      return Promise.resolve(this.dataStructure);
    }

    return new Promise(resolve => {
      this.http.get('http://enesca.polarbeardevelopment.com/mock/getStructure.php')
        .map(res => res.json())
        .subscribe(data => {
          this.dataStructure = data;
          resolve(this.dataStructure);
        }, (error) => {
          console.log('Error');
        })
    });
  }

  getAccessories() {
    if (this.dataAccessories) {
      return Promise.resolve(this.dataAccessories);
    }

    return new Promise(resolve => {
      this.http.get('http://enesca.polarbeardevelopment.com/mock/getAccesories.php')
        .map(res => res.json())
        .subscribe(data => {
          this.dataAccessories = data;
          resolve(this.dataAccessories);
        }, (error) => {
          console.log('Error');
        })
    });
  }
}
