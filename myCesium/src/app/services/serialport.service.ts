import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SerialPortsService {
  private socket: WebSocket | undefined;
  public _messages: Subject<any>;


  constructor() {
    this._messages = new Subject<any>();
  }

  public connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onopen = (event) => {
      console.log('WebSocket connected:', event);
       this.sendMessage(JSON.stringify({type:'getSerialPorts'}));  
    };

    this.socket.onmessage = (event) => {
      console.log(event);
      this._messages.next(event.data);
      console.log(event.data);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event);
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };
  }

  public sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn('WebSocket not connected. Message not sent.');
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
    }
  }
}