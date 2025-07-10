import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OlpService } from '../modules/olp/olp.service';

@Component({
  selector: 'app-olp-team-assign',
  templateUrl: './olp-team-assign.component.html',
  styleUrls: ['./olp-team-assign.component.css'],
  providers: [MessageService],
  standalone: false
})
export class OlpTeamAssignComponent implements OnInit {



  roles: any = [];
  expandedOlpRows = {};
  selectedOlp: any = null;
  selectedEvent: any = null;
  selectedAssignments: { [role: string]: any } = {};
  displayDialog: boolean = false;
  OLPEventTeamData: any = [];
  olpTeamLists: any = []
  constructor(private messageService: MessageService, private olpService: OlpService) {
  }

  ngOnInit(): void {
    this.getOLPEventTeamData();
    this.getOLPMaster();
  }
  getOLPEventTeamData() {
    this.olpService.getAllOLPEnquires('WeddingEvents').subscribe((data: any) => {
      if (data) {
        data.forEach((lead: any) => {
          if (lead.events && Array.isArray(lead.events)) {
            lead.events = lead.events.map((event: any) => ({
              ...event,
              eventTeams: event.eventTeams ?? []
            }));
          }
          const allAssigned = lead.events.every((ev: any) => ev.eventTeams.length > 0);
          lead.teamStatus = allAssigned ? 'Closed' : 'New';
        });

        data = data.filter((i: any) => i.callStatus.name === 'Closed' && i.teamStatus === 'New')
        this.OLPEventTeamData = data
      }
    })
  }
  getOLPMaster() {
    this.olpService.getOLPMaster('OlpMaster/getOlpMaster').subscribe((data: any) => {
      this.olpTeamLists = data.olpAssignTeams;
      this.roles = [...new Set(this.olpTeamLists.map((member: any) => member.value))];
    })
  }
  openAssignDialog(olp: any, event: any) {
    this.selectedOlp = olp;
    this.selectedEvent = event;
    this.selectedAssignments = {};

    for (const role of this.roles) {
      const assigned = event.eventTeams.find((m: any) => m.value === role);
      this.selectedAssignments[role] = assigned || null;
    }

    this.displayDialog = true;
  }

  getAvailableEmployees(role: string) {
    if (!this.selectedEvent) return [];

    return this.olpTeamLists.filter(
      (e: any) =>
        e.value === role &&
        !this.isAlreadyAssigned(e.id, role)
    );
  }

  isAlreadyAssigned(employeeId: number, roleToAssign: string): boolean {
    return this.selectedEvent.eventTeams.some(
      (m: any) => m.id === employeeId && m.value !== roleToAssign
    );
  }

  assignTeam() {
    const assigned: any[] = [];

    for (const role of this.roles) {
      const employee = this.selectedAssignments[role];
      if (employee) {
        if (assigned.some((e) => e.id === employee.id)) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Duplicate Assignment',
            detail: `${employee.name} is already selected for another role.`,
          });
          return;
        }
        assigned.push(employee);
      }
    }

    this.selectedEvent.eventTeams = assigned;
    this.messageService.add({
      severity: 'success',
      summary: 'Team Assigned',
      detail: `Team assigned to ${this.selectedEvent.eventName.name}`,
    });

    // Optionally update OLP team status if all events have teams
    this.updateOlpTeamStatus(this.selectedOlp);

    this.displayDialog = false;
  }

  updateOlpTeamStatus(olp: any) {
    const allAssigned = olp.events.every((ev: any) => ev.eventTeams.length > 0);
    olp.teamStatus = allAssigned ? 'Closed' : 'In-progress';
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'Photographer':
        return 'photographer';
      case 'Videographer':
        return 'videographer';
      case 'Editor':
        return 'editor';
      default:
        return '';
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
  areAllTeamsAssigned(olp: any): boolean {
    return olp.events.every((ev: any) => ev.eventTeams && ev.eventTeams.length > 0);
  }

  submitOlpTeam(olp: any): void {
    console.log(olp)
    this.olpService.updateOLPEnquiry(olp.id, olp).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Approved',
          detail: 'Team Assign and moved to Inventory Assign successfully.'
        });
        this.getOLPEventTeamData();
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

}
