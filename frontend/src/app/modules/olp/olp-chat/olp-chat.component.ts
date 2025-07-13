import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { OlpService } from '../olp.service';

@Component({
  selector: 'app-olp-chat',
  templateUrl: './olp-chat.component.html',
  styleUrls: ['./olp-chat.component.css'],
  standalone: false
})
export class OlpChatComponent implements OnInit {
  clientChats: {
    room: string;
    lastMessage: string;
    timestamp: Date;
    lastSender: string;
    clientName?: string;
  }[] = [];

  selectedRoom: string = '';
  chatMessages: any[] = [];
  chatText: string = '';
  adminName = 'Admin';
  selectedClientName: string = 'Client';

  constructor(
    private chatService: ChatService,
    private olpService: OlpService
  ) {}

  ngOnInit(): void {
    this.loadRoomsWithClientNames();

    // ✅ Listen for all incoming messages once
    this.chatService.receiveMessages().subscribe((msg) => {
      if (msg.room === this.selectedRoom) {
        this.chatMessages.push(msg);
        this.scrollToBottom();
      }

      // 🔁 Update sidebar with last messages
      this.loadRoomsWithClientNames();
    });
  }

  loadRoomsWithClientNames(): void {
    this.chatService.getAllRoomsWithLastMessages().subscribe((rooms: any[]) => {
      const fetches = rooms.map((room, index) =>
        this.olpService.getClientNameByOLPID(room.room).toPromise()
          .then((data: any) => {
            rooms[index].clientName = data?.Bride && data?.Groom
              ? `${data.Bride} & ${data.Groom}`
              : room.room;
          })
          .catch(() => {
            rooms[index].clientName = room.room;
          })
      );

      Promise.all(fetches).then(() => {
        this.clientChats = rooms;
      });
    });
  }

  selectRoom(room: string): void {
    this.selectedRoom = room;
    this.chatMessages = [];

    const selected = this.clientChats.find(c => c.room === room);
    this.selectedClientName = selected?.clientName || 'Client';

    this.chatService.joinRoom(room);

    this.chatService.getChatHistory(room).subscribe((history) => {
      this.chatMessages = history;
      this.scrollToBottom();
    });
  }

  sendChatMessage(): void {
    if (this.chatText.trim()) {
      const msg = {
        room: this.selectedRoom,
        sender: this.adminName,
        text: this.chatText,
        time: new Date()
      };

      // Immediately show the message in UI
      this.chatMessages.push({ ...msg });
      this.scrollToBottom();

      // Send it to server
      this.chatService.sendMessage(msg);

      // Clear input
      this.chatText = '';
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const container = document.querySelector('.messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
}
