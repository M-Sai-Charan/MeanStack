import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { OlpService } from '../olp.service';

@Component({
  selector: 'app-olp-menu',
  templateUrl: './olp-menu.component.html',
  styleUrl: './olp-menu.component.css',
  standalone: false,
  providers: [MessageService]
})
export class OlpMenuComponent implements OnInit {
  isDarkMode = false;
  selectedColor: string = '#111827';
  menuItems = [];

  allowedMenuItems: any = [];
  employeeName = '';
  employeeAvatarUrl = '';
  profileDropdownOpen = false;
  userId: string = '';
  constructor(private router: Router, public authService: AuthService, private messageService: MessageService, private olpService: OlpService) { }
  ngOnInit(): void {
    const currentUser = localStorage.getItem('currentUser');
    this.employeeName = currentUser ? JSON.parse(currentUser)['name'] : '';
    this.employeeAvatarUrl = currentUser ? JSON.parse(currentUser)['data']['profilePic'] : 'https://primefaces.org/cdn/primeng/images/demo/avatar/walter.jpg';
    this.userId = currentUser ? JSON.parse(currentUser)['id'] : ''
    this.allowedMenuItems = currentUser ? JSON.parse(currentUser)['data']['allowedRoutes'] : [];

    // this.getOLPMasterData()
  }
  getOLPMasterData() {
    this.olpService.getOLPMaster('masterdata').subscribe((res: any) => {
      this.menuItems = res.data.uiRoutes;
      this.allowedMenuItems = this.menuItems.filter((item: any) =>
        this.authService.canAccess(item.route)
      );
    });
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
    localStorage.clear();
    this.router.navigateByUrl('/login')
  }

  applyThemeColor(): void {
    document.documentElement.style.setProperty('--main', this.selectedColor);
  }
  onSettings() {
    this.router.navigate([`/settings/${this.userId}`]);
  }
}
