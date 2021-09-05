import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  public showSuccess(message: string): void {
    this.toastr.success(message, 'Success');
  }

  public showError(message: string): void {
    this.toastr.error(message, 'Error');
  }

  public showInfo(message: string): void {
    this.toastr.info(message, 'Info');
  }

  public showWarning(message: string): void {
    this.toastr.warning(message, 'Warning');
  }
}
