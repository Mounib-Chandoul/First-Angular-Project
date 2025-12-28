import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requireAdminAuth = route.data?.['requireAdminAuth'] as boolean | undefined;

    // Admin routes require full authentication + admin role
    if (requireAdminAuth) {
      if (!this.auth.isLoggedIn()) {
        this.router.navigate(['/admin/login']);
        return false;
      }
      if (!this.auth.isAdmin()) {
        this.router.navigate(['/admin/login']);
        return false;
      }
    }

    // All routes pass (public routes don't require auth)
    return true;
  }
}
