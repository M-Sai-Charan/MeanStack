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
    // Emit online status again after hard refresh
    const user = this.authService.getCurrentUser();
    if (user) {
      this.socketService.emitOnline( user.id);
    }
  }

  @HostListener('window:beforeunload')
  beforeUnloadHandler() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.socketService.emitOffline( user.id);
    }
  }
}

