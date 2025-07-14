import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OlpService } from '../olp.service';
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-olp-client-details',
  templateUrl: './olp-client-details.component.html',
  styleUrl: './olp-client-details.component.css',
  standalone: false,
  providers: [MessageService]
})
export class OlpClientDetailsComponent implements OnInit {
  clients: any = [];
  filteredClients: any[] = [];
  expanded: boolean[] = [];
  selectedClient: any = null;
  searchOLPID: string = '';
  searchControl: FormControl = new FormControl();

  toggleExpanded(index: number): void {
    this.expanded[index] = !this.expanded[index];
  }
  constructor(private messageService: MessageService, private olpService: OlpService) { }

  ngOnInit(): void {
    this.getOLPClients();
    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value => {
      this.filterClients(value);
    });
  }
  getOLPClients() {
    this.olpService.getAllOLPEnquires('clients/final-approved').subscribe((data: any) => {
      this.clients = data.data;
      this.filteredClients = data.data;
    });
  }
  filterClients(query: string): void {
    if (!query || query.trim() === '') {
      this.filteredClients = this.clients;
      return;
    }

    const lowerQuery = query.toLowerCase();

    this.filteredClients = this.clients.filter((client: any) =>
      client.OLPID?.toLowerCase().includes(lowerQuery) ||
      client.Bride?.toLowerCase().includes(lowerQuery) ||
      client.Groom?.toLowerCase().includes(lowerQuery) ||
      client.ContactNumber?.toLowerCase().includes(lowerQuery)
    );
  }

  getIcon(type: string): string {
    switch (type) {
      case 'camera': return 'pi pi-camera';
      case 'lighting': return 'pi pi-sun';
      case 'gimbal': return 'pi pi-directions';
      case 'tripod': return 'pi pi-compass';
      case 'drone': return 'pi pi-send';
      default: return 'pi pi-cog';
    }
  }

}
