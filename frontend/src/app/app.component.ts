import { SharedModule } from './shared/app.module';
import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { SocketService } from './services/socket.service';
@Component({
  selector: 'app-root',
  imports: [SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone:true
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private socketService: SocketService
  ) {}

 ngOnInit(): void {
  this.authService.getLoggedInEmployee().subscribe({
    next: (res) => {
      if (res?.employee?.id) {
        this.socketService.emitOnline(res.employee.id);
      }
    },
    error: (err) => {
      console.log('❌ Not logged in or token invalid');
      // optionally navigate to login or do nothing
    }
  });
}


  @HostListener('window:beforeunload')
  beforeUnloadHandler() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.socketService.emitOffline( user.id);
    }
  }
}

