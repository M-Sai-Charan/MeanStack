import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OlpService } from '../olp.service';
import { MessageService } from 'primeng/api';
import { ToastService } from '../../../shared/components/custom-toast/toast.service';

@Component({
  selector: 'app-olp-enquiry-form',
  templateUrl: './olp-enquiry-form.component.html',
  styleUrls: ['./olp-enquiry-form.component.css'],
  standalone: false,
  providers: [MessageService]
})
export class OlpEnquiryFormComponent implements OnInit {
  contactForm!: FormGroup;
  submitted = false;
  olpEventsLists: any[] = [];

  constructor(
    private olpService: OlpService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, this.brideGroomValidator]],
      lastName: [''],
      location: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      message: ['', [Validators.required]],
      preShoot: ['', [Validators.required]],
      source: ['', Validators.required],
    });

    this.getOLPMasterData();
  }

  brideGroomValidator(control: FormControl) {
    const value = control.value || '';
    const parts = value.split('&').map((part: any) => part.trim());
    if (parts.length !== 2 || parts[0] === '' || parts[1] === '') {
      return { invalidFormat: true };
    }
    return null;
  }

  getOLPMasterData() {
    this.olpService.getOLPMaster('masterdata').subscribe((res: any) => {
      this.olpEventsLists = res.data.eventTypes
    });
  }


  onSubmit() {
    this.toast.show('success', 'Form Submitted', 'Your response has been recorded!');
    // if (this.contactForm.valid) {
    //   const jsonObj = this.convertJson(this.contactForm.value);
    //   console.log(jsonObj)
    //   const jsonStr = encodeURIComponent(JSON.stringify(jsonObj));
    //   // const url = `https://localhost:7167/api/OLP/SetEnquiryDetails?value=${jsonStr}`;

    //   this.olpService.saveOLPEnquiry('enquiry', jsonObj).subscribe({
    //     next: () => {
    //       this.messageService.add({
    //         severity: 'success',
    //         summary: 'Reject',
    //         detail: 'Enquiry Added successfully.'
    //       });
    //     },
    //     error: () => {
    //       this.messageService.add({
    //         severity: 'error',
    //         summary: 'Failed',
    //         detail: 'Something went wrong while saving.'
    //       });
    //     }
    //   });
    // }
  }

  convertJson(data: any) {
    const names = data.firstName.split('&').map((n: string) => n.trim());
    const bride = names[0] || '';
    const groom = names[1] || '';
    const preWeddingSelected = data.preShoot
      .map((event: any) => ({
        EventName: event,
        EventDate: '',
        EventLocation: '',
        EventTime: '',
        EventGuests: '',
      }));

    return {
      Bride: bride,
      Groom: groom,
      ContactNumber: data.phone,
      Email: data.email,
      Location: data.location,
      Comments: data.message,
      Source: data.source,
      Events: preWeddingSelected,
    };
  }
}