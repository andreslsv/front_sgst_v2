import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estandar } from '../entities/estandar';

@Injectable({
  providedIn: 'root'
})
export class EstandarHttpAdapter {

  private readonly baseUrl = 'https://api.example.com/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<Estandar[]> {
    return this.http.get<Estandar[]>(this.baseUrl);
  }

}
