import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, tap, Observable } from 'rxjs';
import { empresa } from 'app/models/empresa';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  prefix = 'graphql';
  httpOptions = {
    headers: new HttpHeaders({ 
      'Access-Control-Allow-Origin':'*',
      'Authorization':'Bearer '+localStorage.getItem('accessToken'),
      'Content-Type': 'application/json'
    })
  };

  constructor(private readonly _httpClient:HttpClient) {
  }

  public getData(queryProps,queryParams,nombreQuery): Observable<any>{
    return this._httpClient.get(`${environment.serverUrl}/${this.prefix}/secret?query=query{${nombreQuery}(${queryParams}){${queryProps}}}`, this.httpOptions);
  }
  public getDataSimple(queryProps, nombreQuery): Observable<any> {
    return this._httpClient.get(`${environment.serverUrl}/${this.prefix}/secret?query=query{${nombreQuery}{${queryProps}}}`, this.httpOptions);
  }
  public getUserData( queryParams, nombreQuery): Observable<any> {
    return this._httpClient.get(`${environment.serverUrl}/${this.prefix}/secret?query=query{${nombreQuery}(${queryParams})}`, this.httpOptions);
  }

  public setData(queryProps,queryParams,nombreQuery): Observable<any>{
    return this._httpClient.get(`${environment.serverUrl}/${this.prefix}/secret?query=mutation{${nombreQuery}(${queryParams}){${queryProps}}}`, this.httpOptions);
  }
  currentRecord: any;
  public setEmpresa(empresa: empresa) {
    this.currentRecord = empresa;
    if (empresa) {
      this.cacheLastEmpresa(empresa);
    } else {
      this.deleteCurrentRecordFormCache();
    }
  }
  private cacheLastEmpresa(empresa: empresa) {
    localStorage.setItem('lastEmpresa', JSON.stringify(empresa));
  }
  private deleteCurrentRecordFormCache() {
    localStorage.removeItem('currentRecord');
  }

}
