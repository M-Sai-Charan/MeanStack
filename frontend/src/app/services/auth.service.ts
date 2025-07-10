import { Injectable } from '@angular/core';
import { USERS } from '../../assets/data/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: any = null;

  login(photographerId: string, secretCode: string): boolean {
    const matchedUser = USERS.find(u => u.photographerId === photographerId && u.secretCode === secretCode);
    if (matchedUser) {
      this.currentUser = matchedUser;
      localStorage.setItem('currentUser', JSON.stringify(matchedUser));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  }

  getCurrentUser(): any {
    if (!this.currentUser) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
    return this.currentUser;
  }

  getAllowedRoutes(): string[] {
    const user = this.getCurrentUser();
    return user?.allowedRoutes || [];
  }

  canAccess(route: string): boolean {
    const allowedRoutes = this.getAllowedRoutes();
    return allowedRoutes.includes('*') || allowedRoutes.includes(route);
  }

  getUserName(): string {
    return this.getCurrentUser()?.name || '';
  }

  getUserRole(): string {
    return this.getCurrentUser()?.role || '';
  }
}
