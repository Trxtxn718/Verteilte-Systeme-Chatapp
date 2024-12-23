import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'any'
})
export class SocketService {
  private socket: Socket;

  // Create a new socket connection
  constructor() {
    this.socket = io(environment.ws, {
      path: '/socket.io',
      transports: ['websocket'],
      secure: true,
    });
  }

  // Handle emitting events
  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  // Handle listening for events
  on(event: string): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on(event, (data: any) => observer.next(data));

      return () => {
        this.socket.off(event);
      };
    });
  }
}
