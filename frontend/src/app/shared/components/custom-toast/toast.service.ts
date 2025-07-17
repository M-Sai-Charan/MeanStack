import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  severity: 'success' | 'info' | 'error';
  summary: string;
  detail: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  toastState$ = this.toastSubject.asObservable();

  show(severity: ToastMessage['severity'], summary: string, detail: string) {
    this.toastSubject.next({ severity, summary, detail });
  }
}
