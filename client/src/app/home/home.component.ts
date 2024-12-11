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
  activeChat: any;
  messages: any[] = [];
  chatList: any[] = [];
  messagesList: any[] = [];
  @ViewChild("chatInsertPoint", { read: ViewContainerRef }) cip!: ViewContainerRef;
  @ViewChild("messageInsertPoint", { read: ViewContainerRef }) mip!: ViewContainerRef;
  cipRef!: ComponentRef<ChatListItemComponent>;
  mipRef!: ComponentRef<ChatMessageComponent>;

  @ViewChild(ChatListItemComponent) chatListItem!: ChatListItemComponent;

  addChatComponent(data: any) {
    this.cipRef = this.cip.createComponent(ChatListItemComponent);
    this.cipRef.instance.updateStatus.subscribe((event: ChatListItemComponent) => { this.openChat(event); });
    this.cipRef.instance.chat = data;
    this.chatList.push(this.cipRef.instance);
  }

  addMessage(data: any) {
    this.mipRef = this.mip.createComponent(ChatMessageComponent);
    this.mipRef.instance.message = data;
    this.messagesList.push(this.cipRef.instance);
  }

  constructor(private socketService: SocketService) {
    // get all chats
    // this.addChild({ id: 1, name: 'Chat 1' });
    // fetch('http://localhost:3000/chats?id=' /* + userid */).then((response) => {
    //   response.json().then((data) => {
    //     console.log('Chats:', data);
    //     data.forEach((chat: any) => {
    //       // this.addChild(chat);
    //     });
    //   });
    // }).catch((error) => { console.error(error); });

    this.socketSubscription = this.socketService.on('chat').subscribe((data: any) => {
      console.log('Received chat:', data);
      // this.addChild(data);
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

    document.addEventListener('DOMContentLoaded', () => {
      this.createChat();
    });
  }

  sendMessage() {
    const chatBar = document.getElementById('chat-bar') as HTMLInputElement;
    const message = chatBar.value;
    chatBar.value = '';
    chatBar.style.height = "1.2em";
    console.log('Sending message:', message);

    this.socketService.emit('message', { message });
  }

  openChat(openedChat?: ChatListItemComponent) {
    this.socketSubscription.unsubscribe();
    console.log('Opening chat', openedChat);
    this.chatList.forEach((chat: ChatListItemComponent) => {
      if (chat !== openedChat) {
        chat.active = false;
      }
    });
    this.activeChat = openedChat;

    this.socketSubscription = this.socketService.on('message').subscribe((data: any) => {
      console.log('Received message:', data);
      this.messages.push(data);
    });

    const chatInfo = document.getElementById('chat-info-name') as HTMLElement;
    chatInfo.innerText = openedChat?.chat.name || ' ';
  }

  ngOnDestroy() {
    this.socketSubscription.unsubscribe();
  }

  createChat() {
    console.log('Creating chat');
    const input = document.getElementById('new-chat-input') as HTMLInputElement;
    const chatName = input.value;
    console.log('Chat name:', chatName);
    input.value = '';

    const popup = document.getElementById('new-chat-popup') as HTMLElement;
    popup.style.display = 'none';

    this.addChatComponent({ name: chatName });
  }

  openPopup() {
    const popup = document.getElementById('new-chat-popup') as HTMLElement;
    popup.style.display = 'flex';
  }

  closePopup() {
    const popup = document.getElementById('new-chat-popup') as HTMLElement;
    popup.style.display = 'none';
  }

  leaveChat() {
    console.log('Leaving chat');
    fetch('http://localhost:3000/leave?' + new URLSearchParams({ chat: this.activeChat?.chat.id }).toString(), {
      method: 'POST'
    }).then((response) => {
      console.log('Left chat:', response);
      window.location.reload();
    }).catch((error) => {
      console.error(error);
    });
  }

  getChatHistory() {
    console.log('Getting chat history');
    fetch('http://localhost:3000/messages?' + new URLSearchParams({ chat: this.activeChat?.chat.id }).toString()).then((response) => {
      response.json().then((data) => {
        console.log('Chat history:', data);
        data.forEach((message: any) => {
          this.messages.push(message);
        });
      });
    }).catch((error) => {
      console.error(error);
    });
  }
}
