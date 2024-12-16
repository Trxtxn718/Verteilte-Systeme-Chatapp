import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ChatListItemComponent } from '../chat-list-item/chat-list-item.component';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { Subscription } from 'rxjs';
import { SocketService } from '../socket.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { jwtDecode } from 'jwt-decode';
import cookieParser from 'cookie-parser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChatListItemComponent, ChatMessageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private messageSubscription: Subscription;
  private chatSubscription: Subscription;
  private connectSubscription: Subscription;
  private user: any;
  activeChat?: ChatListItemComponent;
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

  addChatComponent(chat: any, message?: any) {
    this.cipRef = this.cip.createComponent(ChatListItemComponent);
    this.cipRef.instance.updateStatus.subscribe((event: ChatListItemComponent) => { this.openChat(event); });
    this.cipRef.instance.chat = chat;
    this.cipRef.instance.lastMessage = message;
    this.chatList.push(this.cipRef.instance);
  }

  addOldMessage(data: any) {
    this.oipRef = this.oip.createComponent(ChatMessageComponent);
    this.oipRef.instance.message = data;
    this.oldMessagesList.push(this.oipRef.instance);
  }

  addNewMessage(data: any) {
    this.nipRef = this.nip.createComponent(ChatMessageComponent);
    this.nipRef.instance.message = data;
    this.newMessagesList.push(this.nipRef.instance);
  }

  constructor(private http: HttpClient, private socketService: SocketService) {
    this.checkLogin();
    this.connectSubscription = this.socketService.on('connect').subscribe(() => {
      console.log('Connected to server');
      this.socketService.emit('register', this.user.id);
    });

    this.messageSubscription = this.socketService.on('message').subscribe((data: any) => {
      data = JSON.parse(data);
      data.content = data.message;
      console.log('Received message:', data);
      const targetChat = this.chatList.filter((chat: ChatListItemComponent) => chat.chat.id === data.chat_id)[0]
      targetChat.lastMessage = data;
      this.refreshChatListItem(targetChat);

      if (this.activeChat?.chat.id === data.chat_id) {
        this.addNewMessage(data);
      }
    });

    this.chatSubscription = this.socketService.on('chat').subscribe((data: any) => {
      data = JSON.parse(data);
      console.log('Received chat:', data);
      let user;
      if (data.user1.id === this.user.id) {
        user = data.user2;
      } else {
        user = data.user1;
      }
      let chat = { id: data.chat.id, username: user.username };
      this.addChatComponent(chat, { content: '', time: new Date().toLocaleString(), username: user.username });
    });
  }

  ngOnInit() {
    this.checkLogin();
    const chatBar = document.getElementById('chat-bar') as HTMLInputElement;
    if (chatBar) {
      chatBar.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          this.sendMessage();
        }
      });
    }

    document.addEventListener('DOMContentLoaded', () => {
      this.checkLogin();
      if (!this.user) {
        return;
      }
      this.http.get(environment.backend + '/chats/user/' + this.user.id).subscribe((data: any) => {
        console.log('Chats:', data);
        data.forEach((chat: any) => {
          if (!chat.lastMessage) {
            chat.lastMessage = { content: '', time: new Date().toLocaleString(), username: chat.username };
          } else {
            chat.lastMessage.time = new Date(chat.lastMessage.time).toLocaleString();
          }
          this.addChatComponent(chat.chat, chat.lastMessage);
        });
      });

      const chatHistory = document.getElementById('chat-history') as HTMLElement;
      chatHistory.scrollTop = chatHistory.scrollHeight;
    });
  }

  ngOnDestroy() {
    // this.socketSubscription.unsubscribe();
  }

  checkLogin() {
    try {
      let userString = localStorage.getItem('user');
      if (userString === null || userString === undefined || userString === '') {
        window.location.href = '/login';
      } else {
        this.user = JSON.parse(userString);
      }
      this.http.get(environment.backend + '/users/' + this.user.id, { observe: 'response' }).pipe().subscribe({
        next: (response: any) => {
          if (response.status != 200 || !response.body) {
            localStorage.clear();
            window.location.href = '/login';
          }
        }, error: (error) => {
          localStorage.clear();
          window.location.href = '/login';
        }
      });
    } catch (error) {
      localStorage.clear();
      window.location.href = '/login';
    }
  }

  onScroll(event: any) {
    if (event.target.scrollTop === 0) {
      const scrollMax = event.target.scrollTopMax;
      if (this.oldMessagesList.length > 0) {
        this.getChatHistory(this.oldMessagesList[this.oldMessagesList.length - 1].message.id);
        event.target.scrollTop = event.target.scrollTopMax - scrollMax;
      }
    }
  }

  sendMessage() {
    this.checkLogin();
    const chatBar = document.getElementById('chat-bar') as HTMLInputElement;
    if (!this.activeChat || chatBar.value === '') {
      chatBar.value = '';
      chatBar.style.height = "1.2em";
    } else {
      const message = { message: chatBar.value, content: chatBar.value, time: new Date().toLocaleString(), user_id: this.user.id, chat_id: this.activeChat?.chat.id, username: this.user.username };
      chatBar.value = '';
      chatBar.style.height = "1.2em";


      console.log('Sending message:', message);
      this.socketService.emit('message', JSON.stringify(message));

      this.addNewMessage(message);

      const chatHistory = document.getElementById('chat-history') as HTMLElement;
      chatHistory.scrollTop = chatHistory.scrollHeight;

      this.activeChat.lastMessage = message;
      this.refreshChatListItem(this.activeChat);
    }
  }

  refreshChatListItem(chat: ChatListItemComponent) {
    const index = this.chatList.indexOf(chat);
    if (index != this.chatList.length - 1) {
      this.chatList.splice(index, 1);
      this.chatList.push(this.activeChat);
      const chatList = document.getElementById('chat-list') as HTMLElement;
      const chatDom = chatList.childNodes[index]
      chatList.removeChild(chatDom);
      chatList.appendChild(chatDom);
    }
  }

  openChat(openedChat?: ChatListItemComponent) {
    this.checkLogin();
    console.log('Opening chat', openedChat);
    this.chatList.forEach((chat: ChatListItemComponent) => {
      if (chat !== openedChat) {
        chat.active = false;
      }
    });
    this.activeChat = openedChat;

    const chatInfo = document.getElementById('chat-info-name') as HTMLElement;
    chatInfo.innerText = openedChat?.chat.username || '';

    this.clearChatHistory();

    this.getChatHistory();

    const chatHistory = document.getElementById('chat-history') as HTMLElement;
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  createChat() {
    this.checkLogin();
    console.log('Creating chat');
    const input = document.getElementById('new-chat-input') as HTMLInputElement;
    const chatName = input.value;
    if (chatName !== '') {
      input.value = '';

      const popup = document.getElementById('new-chat-popup') as HTMLElement;
      popup.style.display = 'none';

      this.socketService.emit('chat', JSON.stringify({ user_id: this.user.id, target_user: chatName }));
    }
  }

  openPopup() {
    this.checkLogin();
    const popup = document.getElementById('new-chat-popup') as HTMLElement;
    popup.style.display = 'flex';
  }

  closePopup() {
    const popup = document.getElementById('new-chat-popup') as HTMLElement;
    popup.style.display = 'none';
  }

  clearChatHistory() {
    const oldChat = document.getElementById('old') as HTMLElement;
    while (oldChat.childNodes[0] && oldChat.childNodes[0] instanceof HTMLElement) {
      oldChat.removeChild(oldChat.childNodes[0]);
    }
    this.oldMessagesList = [];

    const newChat = document.getElementById('new') as HTMLElement;
    while (newChat.childNodes[0] && newChat.childNodes[0] instanceof HTMLElement) {
      newChat.removeChild(newChat.childNodes[0]);
    }

    this.newMessagesList = [];
  }

  getChatHistory(max_id: number = 0, limit: number = 20, chatId: number = this.activeChat?.chat.id) {
    this.checkLogin();
    console.log('Getting chat history');

    this.http.get(environment.backend + '/messages/chat/' + chatId + '?max_id=' + max_id + '&limit=' + limit).subscribe((data: any) => {
      data.forEach((message: any) => {
        message.time = new Date(message.time).toLocaleString();
        this.addOldMessage(message);
      });
    });
  }
}
