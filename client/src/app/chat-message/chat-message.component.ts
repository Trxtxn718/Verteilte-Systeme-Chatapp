import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  @Input() message?: any;

  constructor() {
    // If no message is provided, create a placeholder
    if (!this.message) {
      this.message = { time: new Date().toLocaleString(), content: 'Placeholder message' };
    } else {
      this.message.time = new Date(this.message.time).toLocaleString();
    }
  }
}
