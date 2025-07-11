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
  olpTeamLists: any = [];
  olpStatusLists: any = [];
  constructor(private messageService: MessageService, private olpService: OlpService) {
  }

  ngOnInit(): void {
    this.getOLPEventTeamData();
  }
  getOLPEventTeamData() {
    this.olpService.getAllOLPEnquires('team/new').subscribe((data: any) => {
      this.getOLPMasterData();
      this.OLPEventTeamData = data.data.filter((val: any) => val.TeamMeta.TeamStatus === 'New')
    });
  }
  getOLPMasterData() {
    this.olpService.getOLPMaster('masterdata').subscribe((res: any) => {
      this.olpStatusLists = res.data.invoiceStatus;
      this.olpTeamLists = res.data.teamMembers;
      this.roles = [...new Set(this.olpTeamLists.map((member: any) => member.role))];
    });
  }
  openAssignDialog(olp: any, event: any) {
    this.selectedOlp = olp;
    this.selectedEvent = event;
    this.selectedAssignments = {};

    for (const role of this.roles) {
      const assigned = event.AssignedTeam.find((m: any) => m.role === role);
      this.selectedAssignments[role] = assigned || null;
    }

    this.displayDialog = true;
  }

  getAvailableEmployees(role: string) {
    if (!this.selectedEvent) return [];

    return this.olpTeamLists.filter(
      (e: any) =>
        e.role === role &&
        !this.isAlreadyAssigned(e.name, role)
    );
  }

  isAlreadyAssigned(employeeId: number, roleToAssign: string): boolean {
    return this.selectedEvent.assignTeam?.some(
      (m: any) => m.name === employeeId && m.role !== roleToAssign
    );
  }

  assignTeam() {
    const assigned: any[] = [];

    for (const role of this.roles) {
      const employee = this.selectedAssignments[role];
      if (employee) {
        if (assigned.some((e) => e.name === employee.id)) {
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

    this.selectedEvent.AssignedTeam = assigned;
    this.messageService.add({
      severity: 'success',
      summary: 'Team Assigned',
      detail: `Team assigned to ${this.selectedEvent.EventName}`,
    });

    // Optionally update OLP team status if all events have teams
    this.updateOlpTeamStatus(this.selectedOlp);

    this.displayDialog = false;
  }

  updateOlpTeamStatus(olp: any) {
    const allAssigned = olp.Events.every((ev: any) => ev.AssignedTeam && ev.AssignedTeam.length > 0);
    olp.TeamStatus = allAssigned ? 'Closed' : 'In-progress';
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
    return olp.Events.every((ev: any) => ev.AssignedTeam && ev.AssignedTeam.length > 0);
  }

  submitOlpTeam(olp: any): void {
    olp.TeamMeta = {
      "AssignedBy": 'Admin',
      "AssignedAt": new Date().toISOString(),
      "TeamStatus": "Closed"
    }
    this.olpService.updateOlPEnquiries(olp._id, olp).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Approved',
          detail: 'Team Assign and moved to Inventory Assign successfully.'
        });
        this.getOLPEventTeamData();
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