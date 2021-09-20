import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';

import { NotificationService } from './services/notification.service';

@Injectable()
export class AppErrorhandler implements ErrorHandler {
  constructor(private injector: Injector, private ngZone: NgZone) {}

  handleError(error: HttpErrorResponse): void {
    this.ngZone.run(() => {
      const notification = this.injector.get(NotificationService);
      notification.showError((error.error?.message) ?? 'Oops! Something went wrong.');
      console.log(error);
    })
  }
}
