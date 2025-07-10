import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OlpService } from '../olp.service';

interface TeamMember {
  id: number;
  name: string;
  value: string; // role
  assignedInventory?: any[];
  tempSelectedInventory?: any;
}

@Component({
  selector: 'app-olp-inventory-assign',
  templateUrl: './olp-inventory-assign.component.html',
  styleUrls: ['./olp-inventory-assign.component.css'],
  providers: [MessageService],
  standalone: false
})
export class OlpInventoryAssignComponent {
  bookings: any[] = [];

  olpInventories = [
    { id: 1, name: 'Canon EOS R5', value: 'camera' },
    { id: 2, name: 'Nikon Z9', value: 'camera' },
    { id: 3, name: 'Sony A7S III', value: 'camera' },
    { id: 4, name: 'Manfrotto Tripod', value: 'tripod' },
    { id: 5, name: 'Benro Tripod', value: 'tripod' },
    { id: 6, name: 'Godox LED Panel', value: 'lighting' },
    { id: 7, name: 'Aputure Light Storm', value: 'lighting' },
    { id: 8, name: 'DJI Mavic 3', value: 'drone' },
    { id: 9, name: 'DJI Air 2S', value: 'drone' },
    { id: 10, name: 'Zhiyun Crane 3S', value: 'gimbal' },
    { id: 11, name: 'DJI Ronin-S', value: 'gimbal' }
  ];

  groupedInventories: any[] = [];

  constructor(private olpService: OlpService, private toast: MessageService) { }

  ngOnInit(): void {
    this.groupedInventories = this.groupInventoryOptions();
    this.getOLPEnquires();
  }

  getOLPEnquires() {
    this.olpService.getAllOLPEnquires('WeddingEvents').subscribe((data: any) => {
      if (data) {
        this.bookings = data
          .filter((i: any) => i.callStatus.name === 'Closed' && i.teamStatus === 'Closed' && i.inventoryStatus === "")
          .map((booking: any) => ({
            ...booking,
            events: booking.events.map((event: any) => ({
              ...event,
              eventTeams: (event.eventTeams || []).map((member: any) => ({
                ...member,
                assignedInventory: [],
                tempSelectedInventory: null
              }))
            }))
          }));
      }
    });
  }

  assignInventory(member: TeamMember, inventory: any) {
    if (!member.assignedInventory) {
      member.assignedInventory = [];
    }
    if (!member.assignedInventory.some(inv => inv.id === inventory.id)) {
      member.assignedInventory.push(inventory);
    }
    member.tempSelectedInventory = null;
  }

  removeInventory(member: TeamMember, inventoryId: number) {
    member.assignedInventory = (member.assignedInventory || []).filter(i => i.id !== inventoryId);
  }

  submitAll(olp: any) {
    olp['inventoryStatus'] = "Closed";
    this.olpService.updateOLPEnquiry(olp.id, olp).subscribe({
      next: () => {
        this.toast.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Inventory Assigned successfully.'
        });
        this.getOLPEnquires();
      },
      error: () => {
        this.toast.add({
          severity: 'error',
          summary: 'Failed',
          detail: 'Something went wrong while saving.'
        });
      }
    });
  }

  groupInventoryOptions(): any[] {
    const grouped = this.olpInventories.reduce((acc, item) => {
      const key = item.value;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as { [key: string]: any[] });

    return Object.entries(grouped).map(([label, items]) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      items
    }));
  }
}
