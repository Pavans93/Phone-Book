import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: HttpClient) { }

  /*To fetch contacts*/
  getContacts(): Observable<any[]> {
    const url = 'https://my-json-server.typicode.com/voramahavir/contacts-mock-response/contacts';
    return this.http.get<any[]>(url);
  }
}