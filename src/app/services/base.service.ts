import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestModel } from '../models/request-model';
import { ObjectModel } from '../models/object-model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private objectsUrl = `${environment.API_URL}/constructionObjects`;
  private requestsUrl = `${environment.API_URL}/requests`;

  constructor(private http: HttpClient) { }

  getAllObjects(): Observable<ObjectModel[]> {
    return this.http.get<ObjectModel[]>(this.objectsUrl);
  }
  getAllRequests(): Observable<RequestModel[]> {
    return this.http.get<RequestModel[]>(this.requestsUrl);
  }

  addNewObject(obj: ObjectModel): Observable<ObjectModel> {
    return this.http.post<ObjectModel>(this.objectsUrl, obj);
  }
  submitRequest(req: RequestModel): Observable<RequestModel> {
    return this.http.post<RequestModel>(this.requestsUrl, req);
  }

  delObject(id: number): Observable<any> {
    const url = `${this.objectsUrl}/${id}`;
    return this.http.delete(url);
  }
  delRequest(id: number): Observable<any> {
    const url = `${this.requestsUrl}/${id}`;
    return this.http.delete(url);
  }

  updateRequest(id: number, req: RequestModel): Observable<RequestModel>{
    const url = `${this.requestsUrl}/${id}`;
    req.id = id;
    return this.http.put<RequestModel>(url, req);
  }

  findRequestById(id: number): Observable<RequestModel>{
    return this.http.get<RequestModel>(`${this.requestsUrl}/${id}`);
  }

}
