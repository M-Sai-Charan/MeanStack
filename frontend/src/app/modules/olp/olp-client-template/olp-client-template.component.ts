import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { OlpService } from '../olp.service';
@Component({
  selector: 'app-olp-client-template',
  templateUrl: './olp-client-template.component.html',
  styleUrls: ['./olp-client-template.component.css'],
  providers: [MessageService],
  standalone: false,
})
export class OlpClientTemplateComponent implements OnInit {
  enquiryId: string = '';
  enquiry: any = null;
  totalInvoiceAmount: number = 0;
  centerIndex = 4;
  showEnvelope = true;
  letterVisible = false;
  galleryImages: string[] = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
    '/image4.jpg',
    '/image5.jpg',
    '/image1.jpg',
    '/image4.jpg',
    '/image3.jpg',
    '/image7.jpg',
  ];
  remainingPercentage: number = 100;
  remainingTime: string = '';
  private countdownInterval: any;
  isLinkExpired: boolean = false;
  selectedImage: string | null = null;

  constructor(private olpService: OlpService, private route: ActivatedRoute) { }
  openImageModal(imgUrl: string): void {
    this.selectedImage = imgUrl;
  }

  closeImageModal(): void {
    this.selectedImage = null;
  }
  ngOnInit(): void {
    this.letterVisible = true;
    setTimeout(() => {
      this.showEnvelope = false;
    }, 1000);
    this.enquiryId = this.route.snapshot.paramMap.get('id')!;
    this.getOLPEnquiryFromApi(this.enquiryId);
    this.checkLinkExpiry(); // 👈 Add this
  }
  checkLinkExpiry(): void {
    if (this.enquiry?.InvoiceMeta?.InvoiceApprovedAt) {
      const approvedAt = new Date(this.enquiry.InvoiceMeta.InvoiceApprovedAt);
      const expiryDate = new Date(approvedAt.getTime() + 24 * 60 * 60 * 1000); // ⏰ 6 hours in milliseconds
      // 1 day later

      this.updateCountdown(expiryDate);
      this.countdownInterval = setInterval(() => {
        this.updateCountdown(expiryDate);
      }, 1000);
    } else {
      this.remainingTime = '';
      this.isLinkExpired = false;
      this.remainingPercentage = 100;
    }
  }

  updateCountdown(expiryDate: Date): void {
    const now = new Date().getTime();
    const totalDuration = 24 * 60 * 60 * 1000; // 24 hours
    const distance = expiryDate.getTime() - now;

    if (distance <= 0) {
      this.remainingTime = 'Expired';
      this.isLinkExpired = true;
      this.remainingPercentage = 0;
      clearInterval(this.countdownInterval);
      return;
    }

    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    this.remainingTime = `${hours}h ${minutes}m ${seconds}s`;
    this.isLinkExpired = false;

    const elapsed = totalDuration - distance;
    this.remainingPercentage = Math.max(0, 100 - Math.floor((elapsed / totalDuration) * 100));
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }


  approveEstimate() {
    alert("✅ Thank you! Your estimate is approved.");
    // Optionally call API or route to confirmation screen
  }

  rejectEstimate() {
    alert("❌ Thank you! We’ll contact you to revise the estimate.");
  }
  getOLPEnquiryFromApi(id: string) {
    this.olpService.getEnquiryById(id).subscribe((data: any) => {
      this.enquiry = data;
      if (this.enquiry?.Events?.length) {
        this.totalInvoiceAmount = this.enquiry.Events.reduce(
          (sum: number, ev: any) => sum + (parseInt(ev.FinalApprovedAmount) || 0),
          0
        );
      }
      this.checkLinkExpiry();
    });
  }
}
