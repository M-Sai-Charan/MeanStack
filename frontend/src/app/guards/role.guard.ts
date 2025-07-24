import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const fullPath = this.getFullRoutePath(route);

    if (this.auth.canAccess(fullPath)) {
      return true;
    }

    return this.router.parseUrl('/login');
  }

  private getFullRoutePath(route: ActivatedRouteSnapshot): string {
    // For deeply nested routes like /dashboard/users or /admin/settings
    const pathSegments = [];
    let currentRoute: ActivatedRouteSnapshot | null = route;

    while (currentRoute) {
      if (currentRoute.routeConfig?.path) {
        pathSegments.unshift(currentRoute.routeConfig.path);
      }
      currentRoute = currentRoute.parent;
    }

    return '/' + pathSegments.join('/');
  }
}
