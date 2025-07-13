import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private readonly SOCKET_URL = 'http://localhost:5000';

  constructor(private http: HttpClient) {
    this.socket = io(this.SOCKET_URL, {
      transports: ['websocket']
    });
  }

  joinRoom(room: string) {
    this.socket.emit('joinRoom', room);
  }

  sendMessage(msg: { room: string, sender: string, text: string }) {
    this.socket.emit('chatMessage', msg);
  }

  receiveMessages(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('chatMessage', (msg: any) => {
        observer.next(msg);
      });
    });
  }

  getChatHistory(room: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.SOCKET_URL}/api/chat/history/${room}`);
  }
  getAllRoomsWithLastMessages() {
  return this.http.get<any[]>(`${this.SOCKET_URL}/api/chat/rooms`);
}

}
