import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CustomValidationService {

  public patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) return null;
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }

  public MatchPassword(password: string, confirmPassword: string): null | any {
    return (formGroup: FormGroup): null | any => {
      const passControl = formGroup.controls[password];
      const confirmPassControl = formGroup.controls[confirmPassword];

      if (!passControl || !confirmPassControl) return null;

      if (confirmPassControl.errors && confirmPassControl.errors.passMisMatch)
        return null;

      if (passControl.value !== confirmPassControl.value)
        confirmPassControl.setErrors({ passMisMatch: true });
      else confirmPassControl.setErrors(null);
    };
  }

  public MaxApprovalAmt(totalAppAmt: string, maxAppAmt: string): any | null {
    console.log("Service Works");
    return (formGroup: FormGroup): any | null => {
      const totalAmtControl = formGroup.controls[totalAppAmt];
      const maxApprovalAmtcontrol = formGroup.controls[maxAppAmt];

      if (maxApprovalAmtcontrol.errors && maxApprovalAmtcontrol.errors.MaxAmtNotValid) return null;

      if (maxApprovalAmtcontrol.value > totalAmtControl.value) maxApprovalAmtcontrol.setErrors({MaxAmtNotValid: true});
      else maxApprovalAmtcontrol.setErrors(null);
    }
  }
}
