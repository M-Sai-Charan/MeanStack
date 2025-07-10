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
  olpStatusLists = []
  constructor(private fb: FormBuilder, private messageService: MessageService, private olpService: OlpService) { }

  ngOnInit() {
    this.getOLPBudgetData();
    this.getOLPMaster();
    this.budgetForm = this.fb.group({
      customer: [null, Validators.required]
    });
  }
  getOLPBudgetData() {
    this.olpService.getAllOLPEnquires('WeddingEvents').subscribe((data: any) => {
      if (data) {
        data = data.filter((i: any) => i.callStatus.name === 'Pending')
        this.olpBudgetLists = data
      }
    })
  }
  get formModeTitle() {
    if (!this.selectedCustomer) return '';
    switch (this.selectedCustomer.callStatus.name) {
      case 'New': return 'Add Budget';
      case 'Pending': return 'Review & Approve Budget';
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
    this.selectedCustomer = customer;
    this.formDisabled = false;
    this.budgetForm.reset();
    this.calculateTotalBudget();
  }

  calculateTotalBudget() {
    if (this.selectedCustomer)
      this.totalBudget = this.selectedCustomer.events.reduce(
        (sum: number, e: any) => sum + (+e.eventBudget || 0), 0
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
    customer['callStatus'] = { name: "Closed", value: "Closed" }
    this.olpService.updateOLPEnquiry(customer.id, customer).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Approved',
          detail: 'Budget approved and moved to Team Assign successfully.'
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

  reject(customer: any) {
    this.rejectComment = '';
    this.showRejectDialog = true;
     customer['callStatus'] = {name: "In-progress", value: "In-progress"}
    this.olpService.updateOLPEnquiry(customer.id, customer).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'danger',
          summary: 'Rejected',
          detail: 'Budget rejected and moved to Invoice successfully.'
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
