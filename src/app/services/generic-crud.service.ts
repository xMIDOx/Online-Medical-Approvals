import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root',
})
export class GenericCRUDService {

  constructor(
    private http: HttpClient,
    private envURL: EnvironmentUrlService
  ) {}

  public Get(route: string) {
    return this.http.get(this.createRoute(this.envURL.urlAddress, route));
  }

  public Create(route: string, body: any) {
    return this.http.post(
      this.createRoute(this.envURL.urlAddress, route),
      body,
      this.generateHeaders()
    );
  }

  public Update(route: string, body: any) {
    return this.http.put(
      this.createRoute(this.envURL.urlAddress, route),
      body,
      this.generateHeaders()
    );
  }

  public Delete(route: string) {
    return this.http.delete(this.createRoute(this.envURL.urlAddress, route));
  }

  private createRoute(url: string, route: string) {
    return `${url}/${route}`;
  }

  private generateHeaders() {
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  }

  public toQueryString(obj: Object) {
    var parts = [];
    for (let [key, value] of Object.entries(obj)) {
      if (value != null && value != undefined)
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    }
    return parts.join('&');
  }
}
