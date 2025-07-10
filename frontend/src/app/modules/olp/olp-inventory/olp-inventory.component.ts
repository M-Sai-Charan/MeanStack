import { Component } from '@angular/core';
interface Equipment {
  id: number;
  name: string;
  type: string;
  serial: string;
  assignedTo?: string;
  status: 'Available' | 'In Use' | 'Under Maintenance';
  lastMaintenance?: Date;
  maintenanceLogs: MaintenanceLog[];
  usageBookings: UsageBooking[];
  thumbnail?: string;
}

interface MaintenanceLog {
  date: Date;
  description: string;
  cost?: number;
}

interface UsageBooking {
  from: Date;
  to: Date;
  user: string;
}
@Component({
  selector: 'app-olp-inventory',
  templateUrl: './olp-inventory.component.html',
  styleUrl: './olp-inventory.component.css',
  standalone: false
})
export class OlpInventoryComponent {
  equipmentList: Equipment[] = [
    {
      id: 1,
      name: 'Canon EOS R5',
      type: 'Camera',
      serial: 'C12345',
      assignedTo: 'Alice',
      status: 'In Use',
      lastMaintenance: new Date('2025-04-15'),
      maintenanceLogs: [{ date: new Date('2025-04-15'), description: 'Sensor cleaning', cost: 50 }],
      usageBookings: [{ from: new Date('2025-06-01'), to: new Date('2025-06-03'), user: 'Alice' }],
      thumbnail: 'camera'
    },
    {
      id: 2,
      name: 'DJI Mavic 3',
      type: 'Drone',
      serial: 'D54321',
      status: 'Available',
      maintenanceLogs: [],
      usageBookings: [],
      thumbnail: 'drone'
    }
  ];

  teamMembers = ['Alice', 'Bob', 'Charlie', 'David'];
  equipmentTypes = ['Camera', 'Drone', 'Lens', 'Light'];
  statusOptions = ['Available', 'In Use', 'Under Maintenance'];

  showDetailDrawer = false;
  selectedEquipment?: Equipment;

  searchTerm = '';
  filterType: string | null = null;
  filterStatus: string | null = null;
  selectedEquipments = new Set<number>();
  bulkAssignUser?: string;

  maintenanceDesc = '';
  maintenanceCost?: number;
  maintenanceDate: Date = new Date();

  get filteredEquipmentList(): Equipment[] {
    return this.equipmentList.filter(e =>
      (!this.searchTerm || [e.name, e.serial, e.assignedTo ?? ''].some(val => val.toLowerCase().includes(this.searchTerm.toLowerCase())))
      && (!this.filterType || e.type === this.filterType)
      && (!this.filterStatus || e.status === this.filterStatus)
    );
  }

  isOverdue(equip: Equipment): boolean {
    if (!equip.lastMaintenance) return false;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return equip.lastMaintenance < sixMonthsAgo;
  }

  openDetailDrawer(equip: Equipment) {
    this.selectedEquipment = equip;
    this.showDetailDrawer = true;
    this.maintenanceDesc = '';
    this.maintenanceCost = undefined;
    this.maintenanceDate = new Date();
  }

  closeDetailDrawer() {
    this.showDetailDrawer = false;
    this.selectedEquipment = undefined;
  }

  addMaintenanceLog() {
    if (!this.selectedEquipment || !this.maintenanceDesc.trim()) return;
    this.selectedEquipment.maintenanceLogs.push({
      date: this.maintenanceDate,
      description: this.maintenanceDesc.trim(),
      cost: this.maintenanceCost
    });
    this.selectedEquipment.lastMaintenance = this.maintenanceDate;
    this.maintenanceDesc = '';
    this.maintenanceCost = undefined;
    this.maintenanceDate = new Date();
  }

  assignSelected() {
    if (!this.bulkAssignUser) return;
    this.selectedEquipments.forEach(id => {
      const equip = this.equipmentList.find(e => e.id === id);
      if (equip) {
        equip.assignedTo = this.bulkAssignUser;
        equip.status = 'In Use';
      }
    });
    this.selectedEquipments.clear();
    this.bulkAssignUser = undefined;
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterType = null;
    this.filterStatus = null;
  }

  exportCsv() {
    const headers = ['Name', 'Type', 'Serial', 'Assigned To', 'Status', 'Last Maintenance'];
    const rows = this.filteredEquipmentList.map(e => [
      e.name,
      e.type,
      e.serial,
      e.assignedTo ?? '',
      e.status,
      e.lastMaintenance ? e.lastMaintenance.toLocaleDateString() : ''
    ]);
    const csv = [headers, ...rows].map(row => row.map(val => `"${val}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'equipment_inventory.csv';
    link.click();
  }
}
