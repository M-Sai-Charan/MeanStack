import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class OlpService {

  // private baseUrl = 'https://olp-deploy.azurewebsites.net/api/';
  // private baseUrl = ' https://localhost:7167/api/OLP';
  private baseUrl = 'http://localhost:5000/api'
  // private baseUrl = 'https://onelookphotography.azurewebsites.net/api/olp//';


  constructor(private httpService: HttpService) { }

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
  uploadProfilePic(url:any,formData: FormData) {
    return this.httpService.post<any>(`${url}/api/upload-profile`, formData);
  }
}
