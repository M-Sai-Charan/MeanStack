import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { OlpService } from '../olp.service';

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
  isSumbitted: boolean = false;
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
    private messageService: MessageService,
    private olpService: OlpService
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
      this.isSumbitted = true;
      const { userName, password } = this.olpLoginForm.value;

      this.authService.login({ loginId: userName, password }).subscribe({
        next: (res) => {
          // const allowedRoutes = res.employee?.role === 'Admin' ? ['/dashboard'] : ['/dashboard'];
          // console.log( allowedRoutes[0])
          // const redirectTo = allowedRoutes[0];
          this.messageService.add({
            severity: 'success',
            summary: 'Login Successful',
            detail: `Welcome, ${res.employee.name}`,
            life: 3000
          });
          this.router.navigateByUrl('/dashboard');

        },
        error: (err) => {
          this.isSumbitted = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: err.error?.message || 'Invalid login ID or password',
            life: 3000
          });
        }
      });
    }
  }


  startSlideshow(): void {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slideshowImages.length;
    }, 5000);
  }
}
