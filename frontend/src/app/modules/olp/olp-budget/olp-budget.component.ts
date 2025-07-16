import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MessageService } from 'primeng/api';
import { OlpService } from '../olp.service';
@Component({
  selector: 'app-olp-budget',
  templateUrl: './olp-budget.component.html',
  styleUrl: './olp-budget.component.css',
  standalone: false,
  providers: [MessageService]
})
export class OlpBudgetComponent implements OnInit {
  budgetForm!: FormGroup;
  totalBudget = 0;
  selectedCustomer: any = null;
  formDisabled = false;
  rejectComment: string = '';
  showRejectDialog = false;

  olpBudgetLists = [];
  olpStatusLists = [];
  animateSlideIn: boolean = false;


  constructor(private fb: FormBuilder, private messageService: MessageService, private olpService: OlpService) { }

  ngOnInit() {
    this.getOLPBudgetData();
    // this.getOLPMaster();
    this.budgetForm = this.fb.group({
      customer: [null, Validators.required]
    });
  }
  getOLPBudgetData() {
    this.olpService.getAllOLPEnquires('invoices').subscribe((data: any) => {
      data = data.data.filter((i: any) => i.InvoiceMeta.InvoiceStatus === 'In-progress')
      this.olpBudgetLists = data
    });
  }
  get formModeTitle() {
    if (!this.selectedCustomer) return '';
    switch (this.selectedCustomer.InvoiceMeta.InvoiceStatus) {
      case 'New': return 'Add Budget';
      case 'In-progress': return 'Review & Approve Budget';
      case 'Closed': return 'View Approved Budget';
      case 'Undo': return 'Rejected Budget (Undo Available)';
      default: return '';
    }
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'New': return 'info';
      case 'In-progress': return 'warning';
      case 'Closed': return 'success';
      case 'Pending': return 'danger';
      default: return 'secondary';
    }
  }

  startBudgeting(customer: any) {
     this.animateSlideIn = false;
  this.selectedCustomer = null;
  setTimeout(() => {
    this.selectedCustomer = customer;
    this.formDisabled = false;
    this.budgetForm.reset();
    this.calculateTotalBudget();
    this.animateSlideIn = true;
  }, 50);
  }

  calculateTotalBudget() {
    if (this.selectedCustomer)
      this.totalBudget = this.selectedCustomer.Events.reduce(
        (sum: number, e: any) => sum + (+e.InvoiceAmount || 0), 0
      );
  }
  getOLPMaster() {
    this.olpService.getOLPMaster('OlpMaster/getOlpMaster').subscribe((data: any) => {
      this.olpStatusLists = data.statuses;
    })
  }
  onSubmit() {
    if (this.budgetForm.valid) {
      this.selectedCustomer.status = 'in-progress';
      this.messageService.add({ severity: 'success', summary: 'Quote Generated', detail: 'Moved to in-progress.' });
      this.generatePDF(this.selectedCustomer);
    }
  }

  reviewCustomer(customer: any) {
    this.selectedCustomer = customer;
    this.formDisabled = true;
    this.calculateTotalBudget();
  }

  approve(customer: any) {
    customer.InvoiceMeta.InvoiceApprovedBy = 'Admin';
    customer.InvoiceMeta.InvoiceApprovedAt = new Date().toISOString();
    customer.InvoiceMeta.InvoiceStatus = 'Closed';
    customer.Events = customer.Events.map((event: any) => ({
      ...event,
      FinalApprovedAmount: event.InvoiceAmount,
      Remarks: 'Proceed'
    }));
    customer.InvoiceMeta.TotalApprovedAmount = customer.InvoiceMeta.TotalEstimatedAmount;
    this.olpService.updateOlPEnquiries(customer._id, customer).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Approved',
          detail: 'Budget approved successfully.'
        });
        this.selectedCustomer = null;
        this.getOLPBudgetData();
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
  getTotalApprovedAmount(events: any[]): number {
    const total = events.reduce((acc, event) => {
      const amount = parseFloat(event.FinalApprovedAmount) || 0;
      return acc + amount;
    }, 0);

    return total;
  }
  reject(customer: any) {
    customer.InvoiceMeta.InvoiceApprovedBy = 'Admin';
    customer.InvoiceMeta.InvoiceApprovedAt = new Date().toISOString();
    customer.InvoiceMeta.InvoiceStatus = 'Pending';
    customer.InvoiceMeta.TotalApprovedAmount = this.getTotalApprovedAmount(customer.Events);
    this.olpService.updateOlPEnquiries(customer._id, customer).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Reject',
          detail: 'Budget Rejected successfully.'
        });
        this.selectedCustomer = null;
        this.getOLPBudgetData();
        this.getOLPMaster();
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

  confirmReject() {
    if (this.selectedCustomer) {
      this.selectedCustomer.status = 'rejected';
      this.selectedCustomer.rejectComment = this.rejectComment;
      this.showRejectDialog = false;
      this.messageService.add({
        severity: 'warn',
        summary: 'Rejected',
        detail: `Budget rejected. Comment: ${this.rejectComment || 'No comment'}`
      });
      this.selectedCustomer = null;
    }
  }

  undoReject(customer: any) {
    customer.status = 'in-progress';
    this.messageService.add({ severity: 'info', summary: 'Undo', detail: 'Rejection undone. Back to in-progress.' });
  }

  viewQuote(customer: any) {
    this.selectedCustomer = customer;
    this.formDisabled = true;
    this.calculateTotalBudget();
    this.generatePDF(customer);
  }

  isAllBudgetsEntered(): boolean {
    if (!this.selectedCustomer || !this.selectedCustomer.events) return false;
    return this.selectedCustomer.events.every((event: any) => event.budget && event.budget > 0);
  }

  generatePDF(customer: any) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Customer Budget Quote', 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${customer.name}`, 20, 30);
    doc.text(`Email: ${customer.email}`, 20, 37);
    doc.text(`Phone: ${customer.phone}`, 20, 44);

    doc.text('Events:', 20, 55);
    customer.events.forEach((event: any, i: number) => {
      doc.text(`• ${event.name}: ₹${event.budget}`, 25, 62 + i * 7);
    });

    doc.text(`Total: ₹${customer.events.reduce((sum: number, e: any) => sum + e.budget, 0)}`, 20, 70 + customer.events.length * 7);
    doc.save(`Quote_${customer.name.replace(/\s/g, '_')}.pdf`);
  }

}
