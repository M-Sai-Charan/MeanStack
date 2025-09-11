import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { OlpService } from '../olp.service';

@Component({
  selector: 'app-olp-forgot-password',
  templateUrl: './olp-forgot-password.component.html',
  styleUrls: ['./olp-forgot-password.component.css'],
  providers: [MessageService],
  standalone: false,
})
export class OlpForgotPasswordComponent {
  step = 1;
  emailForm: FormGroup;
  passwordForm: FormGroup;

  userId: string | null = null; // store id returned from backend

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private olpService: OlpService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  // Step 1 → Check email
  getForgotPassword() {
    if (this.emailForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Email',
        detail: 'Please enter a valid email address',
      });
      return;
    }

    const email = this.emailForm.get('email')?.value;
    this.olpService.forgotPassword(email).subscribe({
      next: (res: any) => {
        this.userId = res.id;
        this.passwordForm.patchValue({ username: res.username });

        this.messageService.add({
          severity: 'success',
          summary: 'Email Found',
          detail: 'Please reset your password.',
        });

        this.step = 2;
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'User not found',
        });
      },
    });
  }

  // Step 2 → Reset password
  resetPassword() {
    if (this.passwordForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Input',
        detail: 'Please fill all required fields',
      });
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.getRawValue();
    if (newPassword !== confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Mismatch',
        detail: 'Passwords do not match',
      });
      return;
    }

    this.olpService.resetPassword(this.userId!, newPassword).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Password Updated',
          detail: 'You can now login with your new password.',
        });

        this.emailForm.reset();
        this.passwordForm.reset({ username: '' });
        this.step = 1;
        this.userId = null;
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'Failed to reset password',
        });
      },
    });
  }
}
