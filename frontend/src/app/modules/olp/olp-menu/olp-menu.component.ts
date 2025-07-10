import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-olp-menu',
  templateUrl: './olp-menu.component.html',
  styleUrl: './olp-menu.component.css',
  standalone: false,
  providers:[MessageService]
})
export class OlpMenuComponent implements OnInit {
  isDarkMode = false;
  selectedColor: string = '#111827';
  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Users', icon: 'pi pi-users', route: '/users' },
    { label: 'Invoice', icon: 'pi pi-receipt', route: '/invoice' },
    { label: 'Budget', icon: 'pi pi-wallet', route: '/budget' },
    { label: 'Team Assign', icon: 'pi pi-clipboard', route: '/team-assign' },
    { label: 'Inventory Assign', icon: 'pi pi-warehouse', route: '/inventory-assign' },
    { label: 'Clients', icon: 'pi pi-users', route: '/clients' },
    { label: 'Admin', icon: 'pi-cog', route: '/admin' },
    { label: 'Enquiry Form', icon: 'pi-cloud', route: '/enquiry-form' },
    //  { label: 'Employees', icon: 'pi-cloud', route: '/employees' },
  ];

  allowedMenuItems: any = [];
  employeeName = '';
  employeeAvatarUrl = 'https://primefaces.org/cdn/primeng/images/demo/avatar/walter.jpg';
  profileDropdownOpen = false;
  constructor(private router: Router, public authService: AuthService,private messageService:MessageService) { }
  ngOnInit(): void {
    this.allowedMenuItems = this.menuItems.filter(item =>
      this.authService.canAccess(item.route)
    );
    const currentUser = localStorage.getItem('currentUser');
    this.employeeName = currentUser ? JSON.parse(currentUser)['userName'] : '';

  }
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.messageService.add({
      severity: 'info',
      summary: 'Logged Out',
      detail: 'You have been successfully logged out.'
    });
    this.router.navigateByUrl('/login')
  }

  applyThemeColor(): void {
    document.documentElement.style.setProperty('--main', this.selectedColor);
  }
}
