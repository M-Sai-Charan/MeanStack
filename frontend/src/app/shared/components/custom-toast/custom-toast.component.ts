import { Component, OnInit } from '@angular/core';
import { ToastService, ToastMessage } from './toast.service';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
@Component({
  selector: 'app-custom-toast',
  templateUrl: './custom-toast.component.html',
  styleUrls: ['./custom-toast.component.css'],
  standalone:false,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ]),
  ]
})
export class CustomToastComponent implements OnInit {
 toasts: ToastMessage[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toastState$.subscribe((toast) => {
      this.toasts.push(toast);
      setTimeout(() => this.removeToast(toast), 4000);
    });
  }

  removeToast(toast: ToastMessage) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
