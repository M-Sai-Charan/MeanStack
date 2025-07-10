import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-olp-employees',
  templateUrl: './olp-employees.component.html',
  styleUrl: './olp-employees.component.css',
  standalone: false,
  providers: [ConfirmationService, MessageService],
})
export class OlpEmployeesComponent {
  selectedNodes!: TreeNode[];

  data: TreeNode[] = [
    {
      expanded: true,
      type: 'person',
      data: {
        image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
        name: 'Amy Elsner',
        title: 'Lead Photographer',
      },
      children: [
        {
          type: 'person',
          data: {
            image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png',
            name: 'Sam Rider',
            title: 'Lighting Specialist',
          },
        },
        {
          type: 'person',
          data: {
            image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png',
            name: 'Lisa Wong',
            title: 'Editor',
          },
        },
      ],
    },
  ];

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) { }

  getRoleSeverity(role: string): string {
    switch (role.toLowerCase()) {
      case 'ceo':
      case 'lead photographer':
        return 'success';
      case 'cmo':
      case 'lighting specialist':
        return 'info';
      case 'editor':
        return 'warning';
      case 'assistant':
        return 'help';
      default:
        return 'secondary';
    }
  }

  confirmDelete(node: TreeNode) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${node.data.name}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteNode(node, this.data);
        this.messageService.add({
          severity: 'success',
          summary: 'Removed',
          detail: `${node.data.name} has been removed from the team.`,
          life: 3000,
        });
      },
    });
  }

  deleteNode(nodeToDelete: TreeNode, nodes: TreeNode[]): boolean {
    const index = nodes.indexOf(nodeToDelete);
    if (index !== -1) {
      nodes.splice(index, 1);
      return true;
    }

    for (let node of nodes) {
      if (node.children && this.deleteNode(nodeToDelete, node.children)) {
        return true;
      }
    }
    return false;
  }
}
