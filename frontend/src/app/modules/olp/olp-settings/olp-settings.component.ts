import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OlpService } from '../olp.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-olp-settings',
  templateUrl: './olp-settings.component.html',
  styleUrl: './olp-settings.component.css',
  standalone: false
})
export class OlpSettingsComponent {
  settingsForm: FormGroup;
  profilePicPreview: string | ArrayBuffer | null = null;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private olpService: OlpService, private messageService: MessageService,private activateRoute: ActivatedRoute,private router: Router,private authService: AuthService) {
     const currentUser = localStorage.getItem('currentUser');
     this.profilePicPreview = currentUser? JSON.parse(currentUser)['data']['profilePic'] : 'https://primefaces.org/cdn/primeng/images/demo/avatar/walter.jpg';
    this.settingsForm = this.fb.group({
      profilePic: [''],
      loginId: ['', Validators.required],
      password: ['', [Validators.minLength(6)]]
    });
  }

  onProfilePicUpload(event: any) {
    const file: File = event.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('profilePic', file);
    this.olpService.uploadProfilePic('http://localhost:5000', formData).subscribe({
      next: (res: any) => {
        this.profilePicPreview = res.url;
        this.settingsForm.get('profilePic')?.setValue(res.url);
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Upload Failed', detail: 'Image upload failed' });
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
     if (this.settingsForm.valid) {
      this.olpService.updateEmployeeSettings(this.activateRoute.snapshot.paramMap.get('id'), this.settingsForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Done',
            detail: 'Employee settings updated successfully -> Login Again!'
          });
          this.authService.logout()
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Something went wrong while saving.'
          });
        }
      });
    }
  }
}
