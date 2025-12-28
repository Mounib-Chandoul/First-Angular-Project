import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private API_BASE = 'http://localhost/iset-api/public/index.php';

  constructor(private http: HttpClient) {}

  // PUBLIC ENDPOINTS
  getCategories() {
    return this.http.get<any[]>(`${this.API_BASE}/categories`);
  }

  searchTrainings(q: string) {
    return this.http.get<any[]>(`${this.API_BASE}/trainings/search`, { params: { q } });
  }

  getTrainingDetails(id: number) {
    return this.http.get<any>(`${this.API_BASE}/trainings/${id}`);
  }

  enrollToSession(sessionId: string, payload: { firstName: string; lastName: string; email: string }) {
    return this.http.post(`${this.API_BASE}/sessions/${sessionId}/enroll`, payload);
  }

  checkEnrollment(sessionId: string, email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_BASE}/sessions/${sessionId}/check-enrollment`, { params: { email } });
  }

  // ADMIN ENDPOINTS - Auth
  adminLogin(email: string, password: string) {
    return this.http.post<any>(`${this.API_BASE}/admin/login`, { email, password });
  }

  // SESSIONS CRUD
  getSessions() {
    return this.http.get<any[]>(`${this.API_BASE}/sessions`);
  }

  getSession(id: string) {
    return this.http.get<any>(`${this.API_BASE}/sessions/${id}`);
  }

  createSession(payload: any) {
    return this.http.post<any>(`${this.API_BASE}/sessions`, payload);
  }

  updateSession(id: string, payload: any) {
    return this.http.put<any>(`${this.API_BASE}/sessions/${id}`, payload);
  }

  deleteSession(id: string) {
    return this.http.delete<any>(`${this.API_BASE}/sessions/${id}`);
  }

  // TRAINERS CRUD
  getTrainers() {
    return this.http.get<any[]>(`${this.API_BASE}/trainers`);
  }

  getTrainer(id: string) {
    return this.http.get<any>(`${this.API_BASE}/trainers/${id}`);
  }

  createTrainer(payload: any) {
    return this.http.post<any>(`${this.API_BASE}/trainers`, payload);
  }

  updateTrainer(id: string, payload: any) {
    return this.http.put<any>(`${this.API_BASE}/trainers/${id}`, payload);
  }

  deleteTrainer(id: string) {
    return this.http.delete<any>(`${this.API_BASE}/trainers/${id}`);
  }

  // TRAINING PROGRAMS CRUD
  getTrainingPrograms() {
    return this.http.get<any[]>(`${this.API_BASE}/trainings`);
  }

  getTrainingProgram(id: string) {
    return this.http.get<any>(`${this.API_BASE}/trainings/${id}`);
  }

  createTrainingProgram(payload: any) {
    return this.http.post<any>(`${this.API_BASE}/trainings`, payload);
  }

  updateTrainingProgram(id: string, payload: any) {
    return this.http.put<any>(`${this.API_BASE}/trainings/${id}`, payload);
  }

  deleteTrainingProgram(id: string) {
    return this.http.delete<any>(`${this.API_BASE}/trainings/${id}`);
  }

  // CANDIDATES CRUD
  getCandidates() {
    return this.http.get<any[]>(`${this.API_BASE}/candidates`);
  }

  getCandidate(id: string) {
    return this.http.get<any>(`${this.API_BASE}/candidates/${id}`);
  }

  createCandidate(payload: any) {
    return this.http.post<any>(`${this.API_BASE}/candidates`, payload);
  }

  updateCandidate(id: string, payload: any) {
    return this.http.put<any>(`${this.API_BASE}/candidates/${id}`, payload);
  }

  deleteCandidate(id: string) {
    return this.http.delete<any>(`${this.API_BASE}/candidates/${id}`);
  }

  // CATEGORIES CRUD
  getCategories2() {
    return this.http.get<any[]>(`${this.API_BASE}/categories`);
  }

  getCategory(id: string) {
    return this.http.get<any>(`${this.API_BASE}/categories/${id}`);
  }

  createCategory(payload: any) {
    return this.http.post<any>(`${this.API_BASE}/categories`, payload);
  }

  updateCategory(id: string, payload: any) {
    return this.http.put<any>(`${this.API_BASE}/categories/${id}`, payload);
  }

  deleteCategory(id: string) {
    return this.http.delete<any>(`${this.API_BASE}/categories/${id}`);
  }

  // FILE UPLOAD
  uploadFile(file: File, type: 'pdf' | 'image') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return this.http.post<any>(`${this.API_BASE}/upload`, formData);
  }

}

