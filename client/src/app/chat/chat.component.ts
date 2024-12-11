import { Component } from '@angular/core';
import { ChatMessageComponent } from '../chat-message/chat-message.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ChatMessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  ngOnInit() {
    const chatBar = document.getElementById('chat-bar') as HTMLInputElement;
    if (chatBar) {
      chatBar.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault(); 
          this.sendMessage();
        }
      });
    }
  }

  sendMessage() {
    const chatBar = document.getElementById('chat-bar') as HTMLInputElement;
    const message = chatBar.value;
    chatBar.value = '';
    chatBar.style.height = "1.2em";
    console.log('Message sent:', message);
  }
}
