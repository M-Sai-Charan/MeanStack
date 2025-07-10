import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { OlpService } from '../olp.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-olp-invoice',
  templateUrl: './olp-invoice.component.html',
  styleUrls: ['./olp-invoice.component.css'],
  providers: [MessageService],
  standalone: false,
})
export class OlpInvoiceComponent implements OnInit {
  invoiceData: any[] = [];
  groupedData: { [key: string]: any[] } = {};
  budgetStatuses = ['New', 'In-progress', 'Closed', 'Pending'];
  selectedOlp: any = null;
  selectedForm: FormGroup | null = null;
  dialogVisible = false;
  activeTabIndex = 0;
  olpStatusLists: any = []
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private olpService: OlpService
  ) { }

  ngOnInit(): void {
    this.loadDummyData();
    this.getOLPMaster();
  }

  loadDummyData() {
    this.olpService.getAllOLPEnquires('WeddingEvents').subscribe((data: any) => {
      this.invoiceData = data || [];
      this.groupedData = {};
      for (const status of this.budgetStatuses) {
        this.groupedData[status] = this.invoiceData.filter(i => i.callStatus.name === status);
      }
    });
  }
  getOLPMaster() {
    this.olpService.getOLPMaster('OlpMaster/getOlpMaster').subscribe((data: any) => {
      this.olpStatusLists = data.statuses;
    })
  }
  openOlpDialog(olp: any) {
    this.selectedOlp = olp;
    this.selectedForm = this.fb.group({
      olpId: [{ value: olp.olpId, disabled: true }],
      callStatus: [{ value: olp.callStatus || '', disabled: olp.callStatus?.name !== 'In-progress' }],
      events: this.fb.array(
        olp.events.map((event: any) =>
          this.fb.group({
            eventName: [event.eventName.name],
            eventDate: [{ value: new Date(event.eventDate), disabled: true }],
            eventLocation: [{ value: event.eventLocation, disabled: true }],
            eventTime: [{ value: event.eventTime.name, disabled: true }],
            eventGuests: [{ value: event.eventGuests, disabled: true }],
            eventBudget: [
              { value: event.eventBudget || '', disabled: olp.callStatus?.name !== 'In-progress' },
              olp.callStatus?.name === 'In-progress' ? [Validators.required, Validators.min(1)] : []
            ]
          })
        )
      )
    });
    this.dialogVisible = true;
  }

  get eventsFormArray(): FormArray {
    return this.selectedForm?.get('events') as FormArray;
  }

  saveBudget() {
    if (this.selectedForm?.valid && this.selectedOlp) {
      const rawData = this.selectedForm.getRawValue();

      const updatedOlp = { ...this.selectedOlp };
      updatedOlp.callStatus = rawData.callStatus;
      updatedOlp.events = updatedOlp.events.map((event: any, index: number) => ({
        ...event,
        eventBudget: `${rawData.events[index].eventBudget}`
      }));

      this.olpService.updateOLPEnquiry(updatedOlp.id, updatedOlp).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Invoice saved and moved to Budget successfully.'
          });
          this.dialogVisible = false;
          this.loadDummyData();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Something went wrong while saving.'
          });
        }
      });
    } else {
      this.selectedForm?.markAllAsTouched();
    }

  }

  getSeverity(status: string): string {
    switch (status) {
      case 'New': return 'info';
      case 'In-progress': return 'warning';
      case 'Completed': return 'success';
      case 'Rejected': return 'danger';
      default: return 'info';
    }
  }

  downloadPdf(event: MouseEvent, olp: any) {
    event.stopPropagation();

    const doc = new jsPDF();
    const lineSpacing = 10;
    let y = 20;

    // Header with Title
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('OLP Budget Summary', 105, y, { align: 'center' });
    y += lineSpacing;

    // Basic OLP Info
    doc.setFontSize(12);
    doc.text(`OLP ID: ${olp.olpId}`, 20, y);
    doc.text(`Bride: ${olp.bride}`, 105, y);
    y += lineSpacing;
    doc.text(`Groom: ${olp.groom}`, 20, y);
    doc.text(`Location: ${olp.location}`, 105, y);
    y += lineSpacing;
    doc.text(`Phone: ${olp.contactNumber}`, 20, y);
    doc.text(`Email: ${olp.email}`, 105, y);
    y += lineSpacing;
    doc.text(`Status: ${olp.callStatus?.name || 'N/A'}`, 20, y);
    doc.text(`Source: ${olp.source || 'N/A'}`, 105, y);
    y += lineSpacing;
    doc.text(`Assigned To: ${olp.calledBy?.name || 'N/A'}`, 20, y);
    doc.text(`Called On: ${new Date(olp.callDate).toLocaleDateString()}`, 105, y);
    y += 15;

    // Section Header
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text('Event Details', 20, y);
    y += 8;

    // Prepare table rows
    const tableBody = olp.events.map((ev: any, index: number) => [
      index + 1,
      ev.eventName?.name || 'N/A',
      new Date(ev.eventDate).toLocaleDateString(),
      ev.eventLocation || 'N/A',
      ev.eventTime?.name || 'N/A',
      ev.eventGuests || 'N/A',
      ev.eventBudget ? `${ev.eventBudget}` : '—'
    ]);

    autoTable(doc, {
      head: [[
        'S.No', 'Event', 'Date', 'Location', 'Time', 'Guests', 'Budget'
      ]],
      body: tableBody,
      startY: y,
      styles: {
        halign: 'left',
        fontSize: 10
      },
      headStyles: {
        fillColor: [41, 128, 185], // blue
        textColor: [255, 255, 255]
      },
      margin: { left: 20, right: 20 },
      theme: 'striped'
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Generated by OLP Dashboard', 105, doc.internal.pageSize.height - 10, { align: 'center' });

    doc.save(`${olp.olpId}.pdf`);
  }

}
