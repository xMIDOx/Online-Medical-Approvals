import { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { isObservable } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

import { PendingApproval } from './pending-approval.model';

@Pipe({
  name: 'loadingSpinner',
})
export class LoadingSpinner implements PipeTransform {
  transform(value: any) {
    return isObservable(value)
      ? value.pipe(
          map((value: any) => ({ loading: false, value })),
          startWith({ loading: true }),
          catchError((error) => of({ loading: false, error }))
        )
      : value;
  }
}
