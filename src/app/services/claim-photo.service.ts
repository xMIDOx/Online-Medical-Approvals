import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EditClaimPhoto } from './../models/edit-claim-photo';
import { GenericCRUDService } from './generic-crud.service';

@Injectable({
  providedIn: 'root'
})
export class ClaimPhotoService {
  private readonly baseRoute = 'api/photos/';

  constructor(private http: GenericCRUDService) { }

  public getClaimsPhotos(statusId: number): Observable<Object> {
    return this.http.Get(this.baseRoute + 'getPhotos?statusId=' + statusId);
  }

  public getClaimPhoto(id: number): Observable<Object> {
    return this.http.Get(this.baseRoute + 'getPhoto/' + id);
  }

  public updateClaimPhoto(id: number, claimPhoto: EditClaimPhoto): Observable<Object> {
    return this.http.Update(this.baseRoute + 'EditClaimPhoto/' + id, claimPhoto);
  }
}
