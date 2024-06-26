import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObjectModel } from '../models/object-model';

@Injectable({
  providedIn: 'root',
})
export class ObjectService {
  private objectsUrl = `${environment.API_URL}/constructionObjects`;

  constructor(private http: HttpClient) {}

  getAllObjects(): Observable<ObjectModel[]> {
    return this.http.get<ObjectModel[]>(this.objectsUrl);
  }

  addNewObject(obj: ObjectModel): Observable<ObjectModel> {
    return this.http.post<ObjectModel>(this.objectsUrl, obj);
  }

  delObject(id: string): Observable<any> {
    const url = `${this.objectsUrl}/${id}`;
    return this.http.delete(url);
  }

  updateObject(id: string, obj: ObjectModel): Observable<ObjectModel> {
    const url = `${this.objectsUrl}/${id}`;
    obj.id = id;
    return this.http.put<ObjectModel>(url, obj);
  }

  findObjectById(id: string): Observable<ObjectModel> {
    return this.http.get<ObjectModel>(`${this.objectsUrl}/${id}`);
  }
}
