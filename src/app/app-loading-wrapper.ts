import { Observable, Subject, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

export class LoadingWrapper<T> {
  public data$!: Observable<T>;
  private readonly _errorloading$ = new Subject<boolean>();
  public errorLoading$: Observable<boolean> = this._errorloading$.pipe(shareReplay(1));

  constructor(data: Observable<T>) {
    this.data$ = data.pipe(
      shareReplay(1),
      catchError((error) => {
        this._errorloading$.next(true);
        return throwError(error);
      })
    )
  }
}
