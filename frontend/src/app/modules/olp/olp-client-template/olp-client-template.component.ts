import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

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
 galleryImages: string[] = [
 'https://images.squarespace-cdn.com/content/v1/60b40cb3dd6dc9347755b5ab/7f12f49f-5beb-40be-b559-d3c8bcb5dbce/AYUS5656+copy.jpg?format=300w',
  'https://images.squarespace-cdn.com/content/v1/60b40cb3dd6dc9347755b5ab/060230ca-92ca-4998-b4c5-df9a9a7eaf9d/0H1A6527+copy+3.jpg?format=300w',
  'https://images.squarespace-cdn.com/content/v1/60b40cb3dd6dc9347755b5ab/67baa040-63bf-4b7e-bfc0-a4662b919690/AYUS5834+Post+01.jpg?format=300w',
  'https://images.squarespace-cdn.com/content/v1/60b40cb3dd6dc9347755b5ab/67baa040-63bf-4b7e-bfc0-a4662b919690/AYUS5834+Post+01.jpg?format=300w',
  'OLP', // OLPID center
  'https://images.squarespace-cdn.com/content/v1/60b40cb3dd6dc9347755b5ab/fa31f3fd-6e1d-4429-b8ba-bb377e2cbaea/002.jpg?format=300w',
  'https://images.squarespace-cdn.com/content/v1/60b40cb3dd6dc9347755b5ab/047e8e4c-6b7c-4010-9c1c-9daa679e5cf1/0H1A9717+%281%29.jpg?format=300w',
  'https://images.squarespace-cdn.com/content/v1/60b40cb3dd6dc9347755b5ab/b39f8dca-5a80-4a98-aa85-5af74e650ea5/Bridelan+Paris+-+Anamika+Knanna+Harper%27s+Bazaar+6.jpg?format=300w',
  'https://images.squarespace-cdn.com/content/v1/60b40cb3dd6dc9347755b5ab/a38a4f44-1fca-40af-8fb8-4cab0f570008/AYUS3246+778.jpg?format=300w',
];

isLinkExpired: boolean = false;
  constructor(private route: ActivatedRoute) { }
selectedImage: string | null = null;

openImageModal(imgUrl: string): void {
  this.selectedImage = imgUrl;
}

closeImageModal(): void {
  this.selectedImage = null;
}
  ngOnInit(): void {
    this.enquiryId = this.route.snapshot.paramMap.get('id')!;
    this.getOLPEnquiryMock(this.enquiryId);
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
  // Optionally open feedback form or email
}
  // ✅ Mock function for now
  getOLPEnquiryMock(id: any) {
    const enquiryId = Number(id);

    const mockData = {
      EnquiryDetails: [
        {
          EnquiryID: 58,
          Bride: "read",
          Groom: "unread",
          ContactNumber: "6301587956",
          Email: "read@gmail.com",
          comments: "tresting",
          Location: "hyd",
          Status: "New",
          EnquirySubmissionDate: "2025-07-08T02:19:52.460",
          ReferredFrom: "Instagram",
          OLPID: "58O7L25P",
          events: [
            {
              EventDetailsID: 106,
              EnquiryID: 58,
              EventName: "Bride Mangalsnanam",
              Date: "2025-07-28",
              Time: "Early Morning",
              Location: "Banglore",
              Guests: 200,
              invoice: 25000
            },
            {
              EventDetailsID: 107,
              EnquiryID: 58,
              EventName: "Groom Mangalsnanam",
              Date: "2025-07-29",
              Time: "Afternoon",
              Location: "Chennai",
              Guests: 400,
              invoice: 45000
            }
          ]
        }
      ]
    };

    const filtered = mockData.EnquiryDetails.filter(
      (e: any) => e.EnquiryID === enquiryId
    );
    this.enquiry = filtered[0];

    if (this.enquiry?.events?.length) {
      this.totalInvoiceAmount = this.enquiry.events.reduce(
        (sum: number, ev: any) => sum + (ev.invoice || 0),
        0
      );
    }
  }

  //   getOLPEnquiryFromApi(id: any) {
  //   const enquiryId = Number(id);
  //   this.olpService.getAllOLPEnquires('GetMasterData').subscribe((data: any) => {
  //     if (data?.EnquiryDetails && data?.EventDetails) {
  //       const enriched = this.getOLPData(data);
  //       const matched = enriched.EnquiryDetails.find(
  //         (e: any) => e.EnquiryID === enquiryId
  //       );
  //       this.enquiry = matched;
  //       if (matched?.events?.length) {
  //         this.totalInvoiceAmount = matched.events.reduce(
  //           (sum: number, ev: any) => sum + (ev.invoice || 0),
  //           0
  //         );
  //       }
  //     }
  //   });
  // }

}
