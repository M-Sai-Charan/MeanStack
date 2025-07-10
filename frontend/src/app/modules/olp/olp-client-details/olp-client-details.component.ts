import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OlpService } from '../olp.service';

@Component({
  selector: 'app-olp-client-details',
  templateUrl: './olp-client-details.component.html',
  styleUrl: './olp-client-details.component.css',
  standalone: false,
  providers: [MessageService]
})
export class OlpClientDetailsComponent implements OnInit {
  clients: any = []
  expanded: boolean[] = [];
  selectedClient: any = null;

  toggleExpanded(index: number): void {
    this.expanded[index] = !this.expanded[index];
  }
  constructor(private messageService: MessageService, private olpService: OlpService) { }

  ngOnInit(): void {
    this.getOLPClients();
  }
  getOLPClients() {
    this.olpService.getAllOLPEnquires('WeddingEvents').subscribe((data: any) => {
      if (data) {
        data = data.filter((i: any) => i.callStatus.name === 'Closed' && i.teamStatus === 'Closed' && i.inventoryStatus === "Closed")
        this.clients = data
        this.clients = this.clients.map((client: any) => ({ ...client, expanded: false }));
      }
    })
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
