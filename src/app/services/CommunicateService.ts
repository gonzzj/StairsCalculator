import {Injectable, EventEmitter} from "@angular/core";

@Injectable()
export class CommunicateService {
  submitted: EventEmitter<boolean> = new EventEmitter<boolean>();

  isSubmit(value: boolean) {
    this.submitted.emit(value);
  }
}
