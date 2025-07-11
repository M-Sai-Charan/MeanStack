import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OlpService } from '../olp.service';

interface TeamMember {
  id: number;
  name: string;
  role: string; // role
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
  roleInventoryMap: Record<string, any[]> = {};
  constructor(private olpService: OlpService, private toast: MessageService) { }

  ngOnInit(): void {
    this.groupedInventories = this.groupInventoryOptions();
    this.getOLPEnquires();
    this.getOLPMasterData();
  }

  getOLPEnquires() {
    this.olpService.getAllOLPEnquires('inventory/new').subscribe((data: any) => {
      this.bookings = data.data.filter((val: any) => val.InventoryMeta.InventoryStatus === 'New')
    });
    // this.olpService.getAllOLPEnquires('WeddingEvents').subscribe((data: any) => {
    //   if (data) {
    //     this.bookings = data
    //       .filter((i: any) => i.callStatus.name === 'Closed' && i.teamStatus === 'Closed' && i.inventoryStatus === "")
    //       .map((booking: any) => ({
    //         ...booking,
    //         events: booking.events.map((event: any) => ({
    //           ...event,
    //           eventTeams: (event.eventTeams || []).map((member: any) => ({
    //             ...member,
    //             assignedInventory: [],
    //             tempSelectedInventory: null
    //           }))
    //         }))
    //       }));
    //   }
    // });
  }

  getOLPMasterData() {
    this.olpService.getOLPMaster('masterdata').subscribe((res: any) => {
      const masters = res.data.inventoryMasters || [];

      // Create a role-to-inventory map for quick access
      this.roleInventoryMap = {};
      masters.forEach((entry: any) => {
        this.roleInventoryMap[entry.role] = entry.inventory.map((inv: string, i: number) => ({
          id: `${entry.role}-${i}`,
          name: inv,
          role: entry.role
        }));
      });

      this.olpInventories = masters; // keep if you use it elsewhere
    });
  }

  assignInventory(member: TeamMember, inventory: any) {
    if (!member.assignedInventory) {
      member.assignedInventory = [];
    }
    if (inventory.role !== member.role) {
      this.toast.add({
        severity: 'warn',
        summary: 'Invalid',
        detail: `This inventory is not allowed for ${member.role}`
      });
      return;
    }
    if (!member.assignedInventory.some(i => i.id === inventory.id)) {
      member.assignedInventory.push(inventory);
    }
    member.tempSelectedInventory = null;
  }


  removeInventory(member: TeamMember, inventoryId: number) {
    member.assignedInventory = (member.assignedInventory || []).filter(i => i.id !== inventoryId);
  }

  submitAll(olp: any) {
     olp.InventoryMeta = {
      "InventoryAssignedBy": 'Admin',
      "InventoryAssignedAt": new Date().toISOString(),
      "InventoryStatus": "Closed"
    }
    olp.Events = this.transformAssignedInventory(olp.Events)
    this.olpService.updateOlPEnquiries(olp._id, olp).subscribe({
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
  transformAssignedInventory(events: any[]) {
  return events.map(event => ({
    ...event,
    AssignedTeam: event.AssignedTeam.map((member:any) => ({
      ...member,
      assignedInventory: (member.assignedInventory || []).map((item:any) => item.name)
    }))
  }));
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
