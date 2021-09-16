import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';

import { NotificationService } from './services/notification.service';

@Injectable()
export class AppErrorhandler implements ErrorHandler {
  constructor(private injector: Injector, private ngZone: NgZone) {}

  handleError(error: Error): void {
    this.ngZone.run(() => {
      const notification = this.injector.get(NotificationService);
      notification.showError(error.message);
      console.log(error);
    })
  }
}
