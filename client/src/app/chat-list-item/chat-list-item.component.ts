import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-list-item',
  standalone: true,
  imports: [NgClass],
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.scss'
})
export class ChatListItemComponent {
  @Input() user?: any;
  @Input() lastMessage?: any;
  @Input() selected?: string;

  constructor() {
    if (!this.user) {
      this.user = {username: 'Anonymous', avatar: 'https://www.gravatar.com/avatar/'};
    }
    if (!this.lastMessage) {
      this.lastMessage = {time: new Date().toLocaleString(), message: 'Placeholder message'};
    }
    if (!this.selected || this.selected !== 'true') {
      this.selected = 'false';
    }
  }

  clicked() {
    console.log('ChatListItemComponent clicked');
  }
}
