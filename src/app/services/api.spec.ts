import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private API_BASE = 'http://localhost/iset-api/public/index.php';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE}/categories`);
  }

  searchTrainings(q: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE}/trainings/search`, { params: { q } });
  }

  getTrainingDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_BASE}/trainings/${id}`);
  }

  enroll(payload: { session_id: number; first_name: string; last_name: string; email: string }): Observable<any> {
    return this.http.post<any>(`${this.API_BASE}/enrollments`, payload);
  }
}
