import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const routePath = '/' + route.routeConfig?.path;
    if (this.auth.canAccess(routePath)) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
