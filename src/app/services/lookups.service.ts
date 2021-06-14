import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ICDCodeDiagnosis } from './../models/ICDCode-Diagnosis.model';
import { Member } from './../models/member.model';
import { QueryObject } from './../models/query-object';
import { GenericCRUDService } from './generic-crud.service';

@Injectable({
  providedIn: 'root',
})
export class LookupsService {
  private readonly lookupsEndpoint = 'api/lookups/';
  constructor(private httpRepo: GenericCRUDService) {}

  public getProviders(queryObject: any) {
    return this.httpRepo.Get(
      this.lookupsEndpoint + 'getproviders?' + this.toQueryString(queryObject)
    );
  }

  public getDiagnosis(queryObject: any) {
    return this.httpRepo.Get(
      this.lookupsEndpoint + 'getdiagnosis?' + this.toQueryString(queryObject)
    );
  }

  public getProviderByClaimNum(claimNum: number) {
    return this.httpRepo.Get(
      this.lookupsEndpoint + 'getproviderbyclaimNum?claimFromNum=' + claimNum
    );
  }

  public getProviderById(providerId: number) {
    return this.httpRepo.Get(
      this.lookupsEndpoint + 'getProviderById?providerId=' + providerId
    );
  }

  public getICDCodeById(ICDCodeId: number): Observable<ICDCodeDiagnosis> {
    return this.httpRepo.Get(
      this.lookupsEndpoint + 'getICDCodeById?id=' + ICDCodeId
    ).pipe(map(res => res as ICDCodeDiagnosis));
  }

  public getMedicinesData(querObject: QueryObject) {
    return this.httpRepo.Get(
      this.lookupsEndpoint + 'GetMedicines?' + this.toQueryString(querObject)
    );
  }

  public getMember(cardNumber: number): Observable<Member> {
    return this.httpRepo
      .Get('api/lookups/getmember?cardnumber=' + cardNumber)
      .pipe(map((res) => res as Member));
  }

  public getMedicalServices(providerId: number, queryObject: any) {
    return this.httpRepo.Get(
      this.lookupsEndpoint +
        'getservices?providerId=' +
        providerId +
        '&' +
        this.toQueryString(queryObject)
    );
  }

  private toQueryString(obj: QueryObject) {
    var parts = [];
    for (let [key, value] of Object.entries(obj)) {
      if (value != null && value != undefined)
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
    return parts.join('&');
  }
}
