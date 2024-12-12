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
  oldMessagesList: any[] = [];
  newMessagesList: any[] = [];
  @ViewChild("chatInsertPoint", { read: ViewContainerRef }) cip!: ViewContainerRef;
  @ViewChild("newInsertPoint", { read: ViewContainerRef }) nip!: ViewContainerRef;
  @ViewChild("oldInsertPoint", { read: ViewContainerRef }) oip!: ViewContainerRef;
  cipRef!: ComponentRef<ChatListItemComponent>;
  nipRef!: ComponentRef<ChatMessageComponent>;
  oipRef!: ComponentRef<ChatMessageComponent>;

  @ViewChild(ChatListItemComponent) chatListItem!: ChatListItemComponent;

  addChatComponent(chat: any, message: any) {
    this.cipRef = this.cip.createComponent(ChatListItemComponent);
    this.cipRef.instance.updateStatus.subscribe((event: ChatListItemComponent) => { this.openChat(event); });
    this.cipRef.instance.chat = chat;
    this.cipRef.instance.lastMessage = message;
    this.chatList.push(this.cipRef.instance);
  }

  addOldMessage(data: any) {
    this.oipRef = this.oip.createComponent(ChatMessageComponent);
    this.oipRef.instance.message = data;

    this.oldMessagesList.push(this.cipRef.instance);
  }

  addNewMessage(data: any) {
    this.nipRef = this.nip.createComponent(ChatMessageComponent);
    this.nipRef.instance.message = data;
    this.newMessagesList.push(this.cipRef.instance);
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

      this.getChatHistory().forEach((message: any) => {
        this.addOldMessage(message);
      });

      const chatHistory = document.getElementById('chat-history') as HTMLElement;
      chatHistory.scrollTop = chatHistory.scrollHeight;
    });
  }

  ngOnDestroy() {
    this.socketSubscription.unsubscribe();
  }

  onScroll(event: any) {
    if (event.target.scrollTop === 0) {
      const scrollMax = event.target.scrollTopMax;
      console.log('Scroll max:', scrollMax);
      console.log('Scrolled to top');
      this.getChatHistory().forEach((message: any) => {
        this.addOldMessage(message);
      });
      event.target.scrollTop = event.target.scrollTopMax - scrollMax;
    }
  }

  sendMessage() {
    const chatBar = document.getElementById('chat-bar') as HTMLInputElement;
    const message = chatBar.value;
    chatBar.value = '';
    chatBar.style.height = "1.2em";
    console.log('Sending message:', message);

    this.addNewMessage({ message, time: new Date().toLocaleString() });

    this.socketService.emit('message', { message });

    const chatHistory = document.getElementById('chat-history') as HTMLElement;
    chatHistory.scrollTop = chatHistory.scrollHeight;
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
    chatInfo.innerText = openedChat?.chat.username || ' ';

    const chatHistory = this.getChatHistory();

    const oldChat = document.getElementById('old') as HTMLElement;
    while (oldChat.childNodes[0] && oldChat.childNodes[0] instanceof HTMLElement) {
      oldChat.removeChild(oldChat.childNodes[0]);
    }

    const newChat = document.getElementById('new') as HTMLElement;
    while (newChat.childNodes[0] && newChat.childNodes[0] instanceof HTMLElement) {
      newChat.removeChild(newChat.childNodes[0]);
    }

    chatHistory.forEach((message: any) => {
      this.addOldMessage(message);
    });
  }

  createChat() {
    console.log('Creating chat');
    const input = document.getElementById('new-chat-input') as HTMLInputElement;
    const chatName = input.value;
    console.log('Chat name:', chatName);
    input.value = '';

    const popup = document.getElementById('new-chat-popup') as HTMLElement;
    popup.style.display = 'none';

    this.addChatComponent({ id: 1 , username: chatName}, { message: '1', time: new Date().toLocaleString(), username: 'User1' });
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
    // console.log('Leaving chat');
    // fetch('http://localhost:3000/leave?' + new URLSearchParams({ chat: this.activeChat?.chat.id }).toString(), {
    //   method: 'POST'
    // }).then((response) => {
    //   console.log('Left chat:', response);
    //   window.location.reload();
    // }).catch((error) => {
    //   console.error(error);
    // });
  }

  getChatHistory(start: number = 0, end: number = 10, chatId: number = this.activeChat?.chat.id) {
    console.log('Getting chat history');
    const messages = [
      { message: '1', time: new Date().toLocaleString(), username: 'User1' },
      { message: '2', time: new Date().toLocaleString(), username: 'User1' },
      { message: '3', time: new Date().toLocaleString(), username: 'User1' },
      { message: '4', time: new Date().toLocaleString(), username: 'User1' },
      { message: '5', time: new Date().toLocaleString(), username: 'User1' },

      { message: '6', time: new Date().toLocaleString(), username: 'User1' },
      { message: '7', time: new Date().toLocaleString(), username: 'User1' },
      { message: '8', time: new Date().toLocaleString(), username: 'User1' },
      { message: '9', time: new Date().toLocaleString(), username: 'User1' },
    ];

    return messages.reverse();
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
