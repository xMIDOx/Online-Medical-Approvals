import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Branch } from '../models/branch.model';
import { PlanMasterBenefit } from '../models/plan-master-benefit.model';
import { Provider } from '../models/provider.model';
import { ICDCodeDiagnosis } from './../models/ICDCode-Diagnosis.model';
import { KeyValue } from './../models/key-value.model';
import { Member } from './../models/member.model';
import { PlanBenefit } from './../models/plan-benefit.model';
import { QueryObject } from './../models/query-object';
import { ServicePrice } from './../models/service-price.model';
import { GenericCRUDService } from './generic-crud.service';

@Injectable({
  providedIn: 'root',
})
export class LookupsService {
  private readonly lookupsEndpoint = 'api/VLookUps/';
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

  public getProviderByClaimNum(claimNum: number): Observable<KeyValue> {
    return this.httpRepo
      .Get(
        this.lookupsEndpoint + 'getproviderbyclaimNum?claimFromNum=' + claimNum
      )
      .pipe(map((res) => res as KeyValue));
  }

  public getProviderById(providerId: number): Observable<Provider> {
    return this.httpRepo
      .Get(this.lookupsEndpoint + 'getProviderById?providerId=' + providerId)
      .pipe(map((res) => res as Provider));
  }

  public getICDCodeById(ICDCodeId: number): Observable<ICDCodeDiagnosis> {
    return this.httpRepo
      .Get(this.lookupsEndpoint + 'getICDCodeById?id=' + ICDCodeId)
      .pipe(map((res) => res as ICDCodeDiagnosis));
  }

  public getMedicinesData(querObject: QueryObject) {
    return this.httpRepo.Get(
      this.lookupsEndpoint + 'GetMedicines?' + this.toQueryString(querObject)
    );
  }

  public getMemberByCardNum(cardNumber: number): Observable<Member> {
    return this.httpRepo
      .Get('api/lookups/GetMemberByCardNum?cardnumber=' + cardNumber)
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

  public getPlanMasterBenefits(
    planId: number
  ): Observable<PlanMasterBenefit[]> {
    return this.httpRepo
      .Get(this.lookupsEndpoint + 'getplanmasters?planId=' + planId)
      .pipe(map((res) => res as PlanMasterBenefit[]));
  }

  public getPlanBenefits(
    planId: number,
    masterId: number
  ): Observable<PlanBenefit[]> {
    return this.httpRepo
      .Get(
        this.lookupsEndpoint +
          'getplanbenefits?planId=' +
          planId +
          '&masterId=' +
          masterId
      )
      .pipe(map((res) => res as PlanBenefit[]));
  }

  public getBranches(providerId: number): Observable<Branch[]> {
    return this.httpRepo
      .Get(this.lookupsEndpoint + 'getBranches?providerId=' + providerId)
      .pipe(map((res) => res as Branch[]));
  }

  public getMedicineById(medicineId: number): Observable<ServicePrice> {
    return this.httpRepo
      .Get(this.lookupsEndpoint + 'GetMedicineById?id=' + medicineId)
      .pipe(map((res) => res as ServicePrice));
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
