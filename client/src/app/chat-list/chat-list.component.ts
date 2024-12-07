import { Component } from '@angular/core';
import { ChatListItemComponent } from '../chat-list-item/chat-list-item.component';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [ChatListItemComponent],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent {

}
