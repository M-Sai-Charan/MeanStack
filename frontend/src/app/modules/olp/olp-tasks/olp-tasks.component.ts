import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface DeliveryTask {
  id: string;
  title: string;
  start: string; // ISO string datetime
  end: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  olpId: string;
  taskType: string;
}

@Component({
  selector: 'app-olp-tasks',
  templateUrl: './olp-tasks.component.html',
  styleUrl: './olp-tasks.component.css',
  standalone:false,
  providers:[MessageService]
})
export class OlpTasksComponent {
   deliveryEvents = [
    {
      id: '1',
      title: 'Wedding Photos Delivery - 002OLP2025',
      date: '2025-06-10',
      extendedProps: {
        olpId: '002OLP2025',
        deliveryType: 'Photo',
        status: 'Pending',
      },
      color: '#fbc02d', // Yellow for pending
    },
    {
      id: '2',
      title: 'Reception Video Delivery - 002OLP2025',
      date: '2025-06-12',
      extendedProps: {
        olpId: '002OLP2025',
        deliveryType: 'Video',
        status: 'Completed',
      },
      color: '#388e3c', // Green for completed
    },
    {
      id: '3',
      title: 'Album Design Delivery - 001OLP2025',
      date: '2025-06-15',
      extendedProps: {
        olpId: '001OLP2025',
        deliveryType: 'Album',
        status: 'Pending',
      },
      color: '#fbc02d',
    },
    {
      id: '4',
      title: 'Social Media Reel - 003OLP2025',
      date: '2025-06-18',
      extendedProps: {
        olpId: '003OLP2025',
        deliveryType: 'Reel',
        status: 'In Progress',
      },
      color: '#1976d2', // Blue for in progress
    },
  ];
 completedEvents = [
    {
      id: 1,
      olpId: '001OLP2025',
      eventName: 'Wedding',
      date: '2025-05-25',
      location: 'Bangalore',
      assignedTasks: [],
    },
    {
      id: 2,
      olpId: '002OLP2025',
      eventName: 'Reception',
      date: '2025-05-27',
      location: 'Chennai',
      assignedTasks: [],
    }
  ];

  taskTypes = ['Photo Editing', 'Video Editing', 'Album Design', 'Reels'];
  teamMembers = [
    { id: 1, name: 'Alice', skill: 'Photo Editing' },
    { id: 2, name: 'Bob', skill: 'Video Editing' },
    { id: 3, name: 'Charlie', skill: 'Album Design' },
    { id: 4, name: 'Diana', skill: 'Reels' },
  ];

  selectedEvent: any = null;
  selectedTasks: { [taskType: string]: any } = {};
  displayDialog: boolean = false;

  constructor(private messageService: MessageService) {
    this.refreshEvents();
  }

  openTaskDialog(event: any) {
    this.selectedEvent = event;
    this.selectedTasks = {};

    for (let task of this.taskTypes) {
      const assigned = event.assignedTasks.find((t: any) => t.task === task);
      this.selectedTasks[task] = assigned?.member || null;
    }

    this.displayDialog = true;
  }

  getAvailableMembers(task: string) {
    return this.teamMembers.filter(m => m.skill === task);
  }

  assignTasks() {
    const assigned: any[] = [];

    for (const task of this.taskTypes) {
      const member = this.selectedTasks[task];
      if (member) {
        assigned.push({ task, member });
      }
    }

    this.selectedEvent.assignedTasks = assigned;
    this.messageService.add({ severity: 'success', summary: 'Tasks Assigned', detail: 'Post-event tasks assigned successfully.' });
    this.displayDialog = false;
  }
   deliveries = [
    {
      id: 1,
      olpId: '001OLP2025',
      couple: 'John & Stella',
      event: 'Wedding',
      eventDate: '2025-06-01',
      editor: 'Alice',
      deliveryItems: [
        { item: 'Photos', status: 'Delivered', deliveredOn: '2025-06-10' },
        { item: 'Videos', status: 'In Progress', deliveredOn: '' },
        { item: 'Album', status: 'Pending', deliveredOn: '' },
        { item: 'Reels', status: 'Pending', deliveredOn: '' },
      ]
    },
    {
      id: 2,
      olpId: '002OLP2025',
      couple: 'Rahul & Priya',
      event: 'Reception',
      eventDate: '2025-05-28',
      editor: 'Bob',
      deliveryItems: [
        { item: 'Photos', status: 'Delivered', deliveredOn: '2025-06-02' },
        { item: 'Videos', status: 'Delivered', deliveredOn: '2025-06-03' },
        { item: 'Album', status: 'In Progress', deliveredOn: '' },
        { item: 'Reels', status: 'Pending', deliveredOn: '' },
      ]
    }
  ];

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'In Progress':
        return 'warning';
      case 'Pending':
        return 'danger';
      default:
        return '';
    }
  }

  allTasks: DeliveryTask[] = [
    {
      id: '1',
      title: 'Photo Editing - Wedding 002OLP2025',
      start: '2025-06-05T10:00:00',
      end: '2025-06-05T14:00:00',
      status: 'Completed',
      olpId: '002OLP2025',
      taskType: 'Photo Editing',
    },
    {
      id: '2',
      title: 'Video Editing - Reception 002OLP2025',
      start: '2025-06-06T09:00:00',
      end: '2025-06-06T13:00:00',
      status: 'Pending',
      olpId: '002OLP2025',
      taskType: 'Video Editing',
    },
    {
      id: '3',
      title: 'Album Design - Wedding 003OLP2025',
      start: '2025-06-07T11:00:00',
      end: '2025-06-07T15:00:00',
      status: 'In Progress',
      olpId: '003OLP2025',
      taskType: 'Album Design',
    }
  ];

  filteredTasks: DeliveryTask[] = [...this.allTasks];

  selectedStatusFilter: 'All' | 'Pending' | 'In Progress' | 'Completed' = 'All';

  selectedTask: DeliveryTask | null = null;
  displayTaskDialog = false;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
  };

 

  refreshEvents() {
    // Filter tasks by status
    this.filteredTasks = this.selectedStatusFilter === 'All'
      ? [...this.allTasks]
      : this.allTasks.filter(t => t.status === this.selectedStatusFilter);

    // Map tasks to calendar events with color coding based on status
    this.calendarOptions.events = this.filteredTasks.map(task => ({
      id: task.id,
      title: task.title,
      start: task.start,
      end: task.end,
      backgroundColor: this.getStatusColor(task.status),
      borderColor: this.getStatusColor(task.status),
    }));
  }

  getStatusColor(status: DeliveryTask['status']) {
    switch (status) {
      case 'Pending':
        return '#f0ad4e'; // orange
      case 'In Progress':
        return '#5bc0de'; // blue
      case 'Completed':
        return '#5cb85c'; // green
      default:
        return '#999';
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    const taskId = clickInfo.event.id;
    const task = this.allTasks.find(t => t.id === taskId);
    if (task) {
      this.selectedTask = { ...task }; // copy for editing
      this.displayTaskDialog = true;
    }
  }

  onStatusFilterChange() {
    this.refreshEvents();
  }

  openNewTaskDialog() {
    this.selectedTask = {
      id: '',
      title: '',
      start: '',
      end: '',
      status: 'Pending',
      olpId: '',
      taskType: '',
    };
    this.displayTaskDialog = true;
  }

  saveTask() {
    if (!this.selectedTask) return;

    if (this.selectedTask.id) {
      // Edit existing
      const index = this.allTasks.findIndex(t => t.id === this.selectedTask!.id);
      if (index !== -1) {
        this.allTasks[index] = { ...this.selectedTask };
      }
    } else {
      // Add new
      this.selectedTask.id = (this.allTasks.length + 1).toString();
      this.allTasks.push({ ...this.selectedTask });
    }

    this.displayTaskDialog = false;
    this.refreshEvents();
  }

  deleteTask() {
    if (!this.selectedTask) return;
    this.allTasks = this.allTasks.filter(t => t.id !== this.selectedTask!.id);
    this.displayTaskDialog = false;
    this.refreshEvents();
  }

}
