import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KeyValue } from 'src/app/models/key-value.model';
import { AuthService } from 'src/app/services/auth.service';

import { GenericCRUDService } from './generic-crud.service';

@Injectable({
  providedIn: 'root',
})
export class UserRolesService {
  private endPoint = 'api/Roles/';

  constructor(private http: GenericCRUDService) {}

  public getRoles(): Observable<KeyValue[]> {
    return this.http
      .Get(this.endPoint + 'getAllRoles')
      .pipe(map((res) => res as KeyValue[]));
  }
}
