import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ChatListItemComponent } from '../chat-list-item/chat-list-item.component';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { Subscription } from 'rxjs';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChatListItemComponent, ChatMessageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private socketSubscription: Subscription;
  messages: any[] = [];
  chatList: any[] = [];
  @ViewChild("viewContainerRef", { read: ViewContainerRef }) vcr!: ViewContainerRef;
  ref!: ComponentRef<ChatListItemComponent>;

  @ViewChild(ChatListItemComponent) chatListItem!: ChatListItemComponent;

  addChild() {
    this.ref = this.vcr.createComponent(ChatListItemComponent);
    this.ref.instance.updateStatus.subscribe((event: ChatListItemComponent) => {this.openChat(event);});
    this.chatList.push(this.ref.instance);
  }

  constructor(private socketService: SocketService) {
    this.socketSubscription = this.socketService.on('message').subscribe((message: any) => {
      console.log('Message received:', message);
      this.messages.push(message);
    });
  }

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

    const chatList = document.getElementById('chat-list') as HTMLElement;
    if (chatList) {
      chatList.addEventListener('click', (event: MouseEvent) => {
        console.log(this.chatList);
      });
    }
  }

  sendMessage() {
    const chatBar = document.getElementById('chat-bar') as HTMLInputElement;
    const message = chatBar.value;
    chatBar.value = '';
    chatBar.style.height = "1.2em";
    console.log('Sending message:', message);

    this.socketService.emit('message', { message });
  }

  openChat(event?: ChatListItemComponent) {
    console.log('Opening chat', event);
    this.chatList.forEach((chat: ChatListItemComponent) => {
      if (chat !== event) {
        chat.active = false;
      }
    });
  }

  ngOnDestroy() {
    this.socketSubscription.unsubscribe();
  }
}
