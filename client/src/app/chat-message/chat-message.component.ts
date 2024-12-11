import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  @Input() user?: any;
  @Input() message?: any;

  constructor() {

    if (!this.user) {
      this.user = {username: 'Anonymous'};
    }

    if (!this.message) {
      this.message = {time: new Date().toLocaleString(), message: 'Placeholder message'};
    }
  }
}
