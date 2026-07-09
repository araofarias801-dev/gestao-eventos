import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, EventRequest, Page } from '../models/event.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService {

  private readonly apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  findAll(page: number = 0, size: number = 10, filters: Record<string, string> = {}): Observable<Page<Event>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params = params.set(key, value);
    });
    return this.http.get<Page<Event>>(this.apiUrl, { params });
  }

  findById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  create(event: EventRequest): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  update(id: number, event: EventRequest): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
