import { Component } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { ChatListComponent } from '../chat-list/chat-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChatComponent, ChatListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
