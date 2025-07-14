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
      // this.letterVisible = true;
      // setTimeout(() => {
      //   this.showEnvelope = false;
      // }, 1000);
    this.enquiryId = this.route.snapshot.paramMap.get('id')!;
    this.getOLPEnquiryFromApi(this.enquiryId);
    this.checkLinkExpiry(); // 👈 Add this
  }
  checkLinkExpiry(): void {
    const expiryDate = new Date('2025-07-10T23:59:59'); // ⏰ Set your expiry dynamically
    const now = new Date();
    this.isLinkExpired = now > expiryDate;
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
    });
  }

}
