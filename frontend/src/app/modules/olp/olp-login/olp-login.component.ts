import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-olp-login',
  templateUrl: './olp-login.component.html',
  styleUrl: './olp-login.component.css',
  standalone: false,
  providers: [MessageService]
})
export class OlpLoginComponent implements OnInit {
  olpLoginForm: FormGroup | undefined;
  userName: string | undefined;
  isHovered: boolean = false;
  loading: boolean = true;
  currentSlide = 0;
  slideshowImages: string[] = [
    'olp-slider1.jpg',
    'olp-slider2.webp',
    'olp-slider3.jpg',
    'olp-slider4.jpg'
  ];

  @ViewChild('bgMusic') bgMusicRef!: ElementRef<HTMLAudioElement>;

  constructor(private router: Router, private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initFormValidation();
    setTimeout(() => {
      this.loading = false;
      this.bgMusicRef?.nativeElement?.play();
      this.startSlideshow();
    }, 2000);
    this.startSlideshow();
  }

  initFormValidation() {
    this.olpLoginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  onLogin(): void {
    if (this.olpLoginForm?.valid) {
      const { userName, password } = this.olpLoginForm.value;

      const success = this.authService.login(userName, password);
      if (success) {
        const allowedRoutes = this.authService.getAllowedRoutes();
        const redirectTo = allowedRoutes[0] === '*' ? '/dashboard' : allowedRoutes[0];
        this.router.navigateByUrl(redirectTo);
      } else {
       this.messageService.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Invalid Photographer ID or Secret Code',
        life: 3000
      });
      }
    }
  }

  startSlideshow(): void {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slideshowImages.length;
    }, 5000);
  }
}
