import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_BASE = 'http://localhost/iset-api/public/index.php';
  private tokenKey = 'auth_token';
  private roleKey = 'auth_role';

  constructor(private http: HttpClient) {}

  /**
   * Login supporting hardcoded credentials for local testing:
   *  - admin / admin -> admin role
   *  - user / user -> normal user role
   * Falls back to backend API if credentials don't match hardcoded values.
   */
  login(username: string, password: string): Observable<any> {
    // hardcoded local auth for testing
    if (username === 'admin' && password === 'admin') {
      const token = 'local-admin-token';
      const user = { role: 'admin', username };
      this.setToken(token);
      this.setRole('admin');
      return of({ token, user });
    }

    if (username === 'user' && password === 'user') {
      const token = 'local-user-token';
      const user = { role: 'user', username };
      this.setToken(token);
      this.setRole('user');
      return of({ token, user });
    }

    // fallback to backend admin login (if backend exists)
    return this.http.post<{ token: string; user?: any }>(`${this.API_BASE}/admin/login`, { email: username, password }).pipe(
      tap(res => {
        if (res?.token) {
          this.setToken(res.token);
          if (res.user?.role) {
            this.setRole(res.user.role);
          }
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setRole(role: string) {
    localStorage.setItem(this.roleKey, role);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
}
