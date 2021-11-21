import { Directive, Input } from '@angular/core';
import { AbstractControl as FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

import { CustomValidationService } from './../../services/custom-validation.service';

@Directive({
  selector: '[appMaxApprovalAmt]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MaxApprovalAmtDirective,
      multi: true,
    },
  ],
})
export class MaxApprovalAmtDirective implements Validator {
  @Input('appMaxApprovalAmt') approvalAmts: string[] = [];

  constructor(private customValidator: CustomValidationService) {
    console.log("Directive Works", this.approvalAmts);
  }

  validate(formGroup: FormGroup): ValidationErrors {

    return this.customValidator.MaxApprovalAmt(this.approvalAmts[0], this.approvalAmts[1])(formGroup);
  }
}
