import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-list-item',
  standalone: true,
  imports: [],
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.scss'
})
export class ChatListItemComponent {
  @Input() name?: string;
  @Input() lastMessage?: string;
  @Input() lastMessageTime?: string;

  constructor() {
    if (!this.name) {
      this.name = '';
    }
    if (!this.lastMessage) {
      this.lastMessage = '';
    }
    if (!this.lastMessageTime) {
      this.lastMessageTime = '0.0.0, 00:00';
    }

    console.log('ChatListItemComponent created');
  }

  clicked() {
    console.log('ChatListItemComponent clicked');
  }
}
