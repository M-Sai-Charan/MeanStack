// src/app/services/socket.service.ts
import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Socket } from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;

    constructor() {
        this.socket = io('http://localhost:5000', {
            transports: ['websocket'], // optional but helps in production
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected:', this.socket.id);
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
        });

        this.socket.on('connect_error', (error: any) => {
            console.error('❌ Socket connection error:', error);
        });
    }

    emitOnline(employeeId: string) {
        this.socket.emit('employee-online', employeeId);
    }

    emitOffline(employeeId: string) {
        this.socket.emit('employee-offline', employeeId);
    }

    onEmployeeOnline(callback: (id: string) => void) {
        this.socket.on('employee-online', callback);
    }

    onEmployeeOffline(callback: (id: string) => void) {
        this.socket.on('employee-offline', callback);
    }

    getSocketId(): string {
        return this.socket.id ?? "";
    }
}
