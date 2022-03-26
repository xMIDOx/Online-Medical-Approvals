import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { KeyValue } from './../models/key-value.model';
import { QueryObject } from './../models/query-object';
import { GenericCRUDService } from './generic-crud.service';

@Injectable({
  providedIn: 'root',
})
export class OnlineLookupsService {
  private readonly lookupsEndpoint = 'api/MLookUps/';

  constructor(private httpRepo: GenericCRUDService) {}

  public getICDCodes(queryObj: QueryObject): Observable<KeyValue> {
    return this.httpRepo
      .Get(
        this.lookupsEndpoint +
          'GetICDCodes?' +
          this.httpRepo.toQueryString(queryObj)
      )
      .pipe(map((res) => res as KeyValue));
  }

  public getMedications(queryObj: QueryObject): Observable<object> {
    return this.httpRepo
      .Get(
        this.lookupsEndpoint +
          'GetMedications?' +
          this.httpRepo.toQueryString(queryObj)
      );
  }

  public GetMedicalServices(queryObj: QueryObject): Observable<KeyValue> {
    return this.httpRepo
      .Get(
        this.lookupsEndpoint +
          'GetMedicalServices?' +
          this.httpRepo.toQueryString(queryObj)
      )
      .pipe(map((res) => res as KeyValue));
  }
}
