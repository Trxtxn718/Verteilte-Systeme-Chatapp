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
  @Input() chat: any;
  @Input() lastMessage: any;
  @Input() selected?: string;

  @Output() updateStatus = new EventEmitter();

  active: boolean = false;

  constructor() {
    // If no chat or lastMessage is provided, create a placeholder
    if (!this.chat) {
      this.chat = { id: 1, username: 'Anonymous' };
    }
    if (!this.lastMessage) {
      this.lastMessage = { time: new Date().toLocaleString(), content: '', username: '' };
    } else {
      this.lastMessage.time = new Date(this.lastMessage.time).toLocaleString();
    }
    if (!this.selected || this.selected !== 'true') {
      this.selected = 'false';
    }
  }

  clicked() {
    // Emit an event to update the status of the chat list item
    console.log('ChatListItemComponent clicked');
    this.active = true;
    this.updateStatus.emit(this);
  }
}
