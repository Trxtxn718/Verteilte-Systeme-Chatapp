import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class SocketService {
  private socket: Socket;


  constructor() {
    this.socket = io('http://localhost:80/ws');
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on(event: string): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on(event, (data: any) => observer.next(data));

      return () => {
        this.socket.off(event);
      };
    });
  }
}
