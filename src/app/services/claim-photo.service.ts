import { Injectable } from '@angular/core';
import { tick } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminEPrescription } from 'src/app/models/admin-e-prescription.model';

import { ClaimPhoto } from './../models/claim-photo.model';
import { EditClaimPhoto } from './../models/edit-claim-photo';
import { GenericCRUDService } from './generic-crud.service';

@Injectable({
  providedIn: 'root',
})
export class ClaimPhotoService {
  private readonly baseRoute = 'api/photos/';

  constructor(private http: GenericCRUDService) {}

  public getClaimsPhotos(
    statusId?: number,
    entryTypeId?: number
  ): Observable<ClaimPhoto[]> {
    if (!statusId) statusId = 0;

    return this.http
      .Get(
        this.baseRoute +
          'getPhotos?statusId=' +
          statusId +
          '&entryTypeId=' +
          entryTypeId
      )
      .pipe(map((res) => res as ClaimPhoto[]));
  }

  public getClaimPhoto(id: number): Observable<ClaimPhoto> {
    return this.http
      .Get(this.baseRoute + 'getPhoto/' + id)
      .pipe(map((res) => res as ClaimPhoto));
  }

  public updateClaimPhoto(
    id: number,
    claimPhoto: EditClaimPhoto
  ): Observable<Object> {
    return this.http.Update(
      this.baseRoute + 'EditClaimPhoto/' + id,
      claimPhoto
    );
  }

  public updateTicket(id: number, ticket: EditClaimPhoto): Observable<Object> {
    return this.http.Update(this.baseRoute + 'EditTicket/' + id, ticket);
  }

  public updateStatus(id: number, statusId: number): Observable<object> {
    return this.http.Get(
      this.baseRoute + 'UpdateStatus?id=' + id + '&statusId=' + statusId
    );
  }

  public createTicket(ticket: AdminEPrescription): Observable<Object> {
    return this.http.Create(this.baseRoute + 'AddTicket', ticket);
  }

  public getDoctorTickets(doctorId: string): Observable<ClaimPhoto[]> {
    return this.http
      .Get(this.baseRoute + 'GetPendingDoctorTickets?doctorId=' + doctorId)
      .pipe(map((res) => res as ClaimPhoto[]));
  }
}
