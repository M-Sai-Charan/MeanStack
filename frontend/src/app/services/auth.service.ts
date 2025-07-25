import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { SocketService } from '../services/socket.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;
  private currentUser: any = null;

  constructor(private http: HttpService, private router: Router, private socketService: SocketService) { }

  login(credentials: { loginId: string; password: string }): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(`${this.baseUrl}/auth/login`, credentials).subscribe({
        next: res => {
          this.currentUser = res.employee;
          localStorage.setItem('token', res.token);
          localStorage.setItem('currentUser', JSON.stringify(res.employee));
          console.log('Emitting online with ID:', res.employee?.id);
          // ✅ Emit online status to socket
          this.socketService.emitOnline(res.employee.id);
          observer.next(res);
          observer.complete();
        },
        error: err => {
          observer.error(err);
        }
      });
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
  getLoggedInEmployee(): Observable<any> {
    const token = this.getToken();
    if (!token) return of(null); // not logged in

    return this.http.get<any>(`${this.baseUrl}/auth/me`);
  }

  getCurrentUser(): any {
    if (!this.currentUser) {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    }
    return this.currentUser;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string {
    return this.getCurrentUser()?.role || '';
  }

  getUserName(): string {
    return this.getCurrentUser()?.name || '';
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Optional: Role or route-based access
  canAccess(route: string): boolean {
    // Modify this logic as needed
    // const allowedRoles = ['Admin', 'HR', 'Production'];
    // return allowedRoles.includes(this.getUserRole());/
    return true
  }
  //   canAccess(route: string): boolean {
  //   const role = this.getUserRole();

  //   const allowedRoutes: Record<string, string[]> = {
  //     Admin: ['/dashboard', '/dashboard/users', '/dashboard/settings'],
  //     HR: ['/dashboard', '/dashboard/employees'],
  //     Production: ['/dashboard', '/dashboard/tasks']
  //   };

  //   return allowedRoutes[role]?.includes(route) ?? false;
  // }

}
