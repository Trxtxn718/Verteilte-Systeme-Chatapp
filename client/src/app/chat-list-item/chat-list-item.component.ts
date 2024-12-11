import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chat-list-item',
  standalone: true,
  imports: [NgClass],
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.scss'
})
export class ChatListItemComponent {
  chat: any;
  @Input() user?: any;
  @Input() lastMessage?: any;
  @Input() selected?: string;
  @Input() update?: boolean;

  @Output() updateStatus = new EventEmitter();

  active: boolean = false;

  constructor() {
    if (!this.user) {
      this.user = { username: 'Anonymous' };
    }
    if (!this.lastMessage) {
      this.lastMessage = { time: new Date().toLocaleString(), message: 'Placeholder message' };
    }
    if (!this.selected || this.selected !== 'true') {
      this.selected = 'false';
    }
  }

  clicked() {
    console.log('ChatListItemComponent clicked');
    this.active = true;
    this.updateStatus.emit(this);
  }
}
