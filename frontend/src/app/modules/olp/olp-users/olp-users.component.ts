import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OlpService } from '../olp.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-olp-users',
  templateUrl: './olp-users.component.html',
  styleUrls: ['./olp-users.component.css'],
  standalone: false,
  providers: [MessageService]
})
export class OlpUsersComponent implements OnInit {
  @ViewChild('dt2') dt2!: Table;

  visible: boolean = false;
  olpuserId: number | null = null;
  selectedStatus: any = null;
  selectedUser: any;
  previousUserData: any = null;
  eventForm!: FormGroup;
  showModal = false;
  isViewOnly = false;
  selectedEventTypes: any[] = [];
  filteredUsers: any[] = [];

  olpStatusLists: any = [];
  olpEventsLists: any = [];
  olpEmployeesLists: any = [];
  olpEventsTimes: any = [];

  olpUsers: any = []
  openedEnquiryIds: number[] = []

  constructor(private router: Router, private fb: FormBuilder, private messageService: MessageService, private olpService: OlpService) { }
  ngOnInit(): void {
    this.filteredUsers = [...this.olpUsers];
    this.getOLPEnquires();
    this.getOLPMasterData();
  }

  getOLPEnquires() {
    this.olpService.getAllOLPEnquires('enquiry/getallenquires').subscribe((data: any) => {
      if (data) {
        this.olpUsers = data
      }
    })
  }
  onReloadUsers() {
    this.getOLPEnquires()
  }
  getOLPData(data: any) {
    data.EnquiryDetails.forEach((element: any) => {
      const matchingEvents = data.EventDetails.filter((event: any) => {
        return event.EnquiryID === element.EnquiryID
      })
      element.events = matchingEvents
    });
    return data
  }
  getOLPMasterData() {
    this.olpService.getOLPMaster('masterdata').subscribe((res: any) => {
      this.olpEmployeesLists = res.data.callInitiates;
      this.olpStatusLists = res.data.callStatus;
      this.olpEventsLists = res.data.eventTypes;
      this.olpEventsTimes = res.data.eventTimes;
    });
  }
  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.dt2) {
      this.dt2.filterGlobal(input.value, 'contains');
    }
  }

  filterByStatus() {
    if (this.selectedStatus?.value) {
      this.dt2.filter(this.selectedStatus.value, 'status', 'equals');
    } else {
      this.dt2.clear();
    }
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'New': return 'success';
      case 'In-progress': return 'warning';
      case 'Pending': return 'danger';
      case 'Closed': return 'info';
      case 'Blocked': return 'secondary';
      default: return '';
    }
  }

  selectOLP(user: any) {
    console.log(user)
    this.visible = true;
    this.getOLPMasterData();
    this.olpuserId = user.OLPID;
    this.selectedUser = user;
    // ✅ Call API to mark as read
    console.log(user._id)
    if (!user.isRead) {
      this.olpService.markEnquiryAsRead(user._id).subscribe({
        next: () => {
          user.isRead = true; // update UI immediately
        },
        error: err => {
          this.messageService.add({
            severity: 'warn',
            summary: 'Sync Failed',
            detail: 'Could not mark enquiry as read in DB.'
          });
        }
      });
    }
    this.initEventForm(user.Events || []);
    // console.log('Opening form for enquiry:', user)
  }
  setFormDisabled(disabled: boolean) {
    if (disabled) {
      this.eventForm.disable({ emitEvent: false });
      this.isViewOnly = true;
    } else {
      this.eventForm.enable({ emitEvent: false });
      this.isViewOnly = false;
    }
  }
  initEventForm(events: any[]) {
    this.eventForm = this.fb.group({
      calledBy: [this.selectedUser.AssignedEmployee || null],
      callDate: [this.selectedUser.CallInitiatedOn ? new Date(this.selectedUser.CallInitiatedOn) : new Date()],
      callStatus: [this.selectedUser.CallStatus || null],
      events: this.fb.array(events.map((e: any) => this.createEventGroup(e)))
    });
  }

  createEventGroup(event: any): FormGroup {
    return this.fb.group({
      _id: [event?._id || 0],
      eventName: [event?.EventName || null, Validators.required],
      eventDate: [event?.EventDate ? new Date(event.EventDate) : null, Validators.required],
      eventLocation: [event?.EventLocation || '', Validators.required],
      eventTime: [event?.EventTime || null, Validators.required],
      eventGuests: [event?.EventGuests ? +event.EventGuests : null, [Validators.required, Validators.min(1)]],
    });
  }


  get eventsFormArray(): FormArray {
    return this.eventForm.get('events') as FormArray;
  }

  addEvent() {
    this.eventsFormArray.push(this.createEventGroup({
      eventName: null,
      eventDate: null,
      eventLocation: '',
      eventTime: null,
      eventGuests: null
    }));
  }

  removeEvent(index: number) {
    this.eventsFormArray.removeAt(index);
  }

  saveEvents() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Failed',
        detail: 'Please fill all required fields',
      });
      return;
    }

    const formEvents = this.eventForm.value.events;

    const updatedEvents = formEvents.map((formEvent: any) => ({
      _id: formEvent._id || 0,
      EventName: formEvent.eventName || {},
      EventDate: formEvent.eventDate,
      EventLocation: formEvent.eventLocation,
      EventTime: formEvent.eventTime || {},
      EventGuests: String(formEvent.eventGuests || '')
    }));

    const updatedUser = {
      ...this.selectedUser,
      AssignedEmployee: this.eventForm.value.calledBy,
      CallInitiatedOn: this.eventForm.value.callDate,
      CallStatus: this.eventForm.value.callStatus,
      Events: updatedEvents
    };
    this.olpService.updateOlPEnquiries(this.selectedUser._id, updatedUser).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Enquiry updated successfully'
        });
        this.visible = false;
        this.getOLPEnquires();
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

  downloadPDF() {
    const doc = new jsPDF();
    doc.text(`OLP Events - ${this.selectedUser.bride} & ${this.selectedUser.groom}`, 10, 10);
    const eventData = this.selectedUser.events.map((e: any, i: number) => [
      i + 1,
      e.eventName?.name || '',
      e.eventDate || '',
      e.eventLocation,
      e.eventTime || '',
      e.eventGuests
    ]);
    autoTable(doc, {
      head: [['#', 'Event Name', 'Date', 'Location', 'Time', 'Guests']],
      body: eventData,
      startY: 20
    });
    doc.save(`${this.selectedUser.bride}_${this.selectedUser.groom}_Events.pdf`);
  }

  trackByIndex(index: number): number {
    return index;
  }

  getUnreadCount(): number {
    return this.olpUsers?.filter((user: any) => user.isRead === false).length || 0;
  }

  getReadPercentage(): number {
    const total = this.olpUsers?.length || 0;
    const read = this.olpUsers?.filter((user: any) => user.isRead === true).length || 0;
    return total ? Math.round((read / total) * 100) : 0;
  }
  getProgressBarClass(value: number): string {
    if (value >= 80) {
      return 'progress-green';
    } else if (value >= 40) {
      return 'progress-orange';
    } else {
      return 'progress-red';
    }
  }
  shareInvoiceTemplate(enquiryId: number) {
    this.router.navigate(['/clientsTemplate', enquiryId]);
  }
}
