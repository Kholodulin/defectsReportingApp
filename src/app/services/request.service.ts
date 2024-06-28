import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestModel } from '../models/request-model';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private requestsUrl = `${environment.API_URL}/requests`;

  constructor(private http: HttpClient) {}

  getAllRequests(): Observable<RequestModel[]> {
    return this.http.get<RequestModel[]>(this.requestsUrl);
  }

  submitRequest(req: RequestModel): Observable<RequestModel> {
    return this.http.post<RequestModel>(this.requestsUrl, req);
  }

  updateRequest(id: string, req: RequestModel): Observable<RequestModel> {
    const url = `${this.requestsUrl}/${id}`;
    req.id = id;
    return this.http.put<RequestModel>(url, req);
  }

  findRequestById(id: string): Observable<RequestModel> {
    return this.http.get<RequestModel>(`${this.requestsUrl}/${id}`);
  }
}
