import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OlpService {

  private baseUrl = environment.apiUrl

  constructor(private httpService: HttpService) { }

  login(payload: { loginId: string; password: string }): Observable<any> {
    return this.httpService.post(`${this.baseUrl}/auth/login`, payload);
  }
  getAllOLPEnquires(url: string): Observable<any[]> {
    return this.httpService.get<any[]>(`${this.baseUrl}/${url}`);
  }
  getOLPMaster(url: string): Observable<any[]> {
    return this.httpService.get<any[]>(`${this.baseUrl}/${url}`);
  }
  updateOLPEnquiry(id: number, payload: any): Observable<any> {
    return this.httpService.put<any>(`${this.baseUrl}WeddingEvents/${id}`, payload);
  }
  markEnquiryAsRead(id: any): Observable<any> {
    return this.httpService.put<any>(`${this.baseUrl}/enquiry/markasread/${id}`, id);
  }
  updateOlPEnquiries(id: number, payload: any): Observable<any> {
    return this.httpService.put<any>(`${this.baseUrl}/enquiry/update/${id}`, payload);
  }
  getEnquiryById(id: string) {
    return this.httpService.get(`${this.baseUrl}/enquiry/${id}`);
  }
  saveOLPEnquiry(url: string, payload: any): Observable<any> {
    return this.httpService.post<any>(`${this.baseUrl}/${url}`, payload);
  }
  saveOLPEmployee(url: string, payload: any, mode: 'Add' | 'Edit'): Observable<any> {
    if (mode === 'Add') {
      return this.httpService.post<any>(`${this.baseUrl}/${url}`, payload);
    } else {
      return this.httpService.put<any>(`${this.baseUrl}${url}/${payload._id}`, payload);
    }
  }
  getClientNameByOLPID(olpid: string) {
    return this.httpService.get<any>(`http://localhost:5000/api/clients/${olpid}`);
  }
  uploadProfilePic(url: any, formData: FormData) {
    return this.httpService.post<any>(`${this.baseUrl}/upload-profile`, formData);
  }
  sendInvoiceEmail(enquiryId: number) {
    return this.httpService.post(`${this.baseUrl}/enquiry/send-invoice/${enquiryId}`, {});
  }
  updateEmployeeSettings(id: any, payload: any) {
    return this.httpService.put<any>(`${this.baseUrl}/employees/${id}/settings`, payload);
  }

  forgortPassword(email: string) {
    return this.httpService.post<any>(`${this.baseUrl}/employees/forgot-password`, { email });
  }
   forgotPassword(email: string): Observable<any> {
   return this.httpService.post<any>(`${this.baseUrl}/employees/forgot-password`, { email });
  }

  resetPassword(id: string, newPassword: string): Observable<any> {
    return this.httpService.post<any>(`${this.baseUrl}/employees/reset-password`, { id, newPassword });
  }
}
