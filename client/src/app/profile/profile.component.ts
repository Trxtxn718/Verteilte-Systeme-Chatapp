import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  ngOnInit() {
    const token = localStorage.getItem('token');
    console.log(token);

    const decodedToken = jwtDecode(token? token : '');

    console.log(decodedToken);

    const username = document.getElementById('username') as HTMLInputElement;
    username.value = 'John Doe';

    console.log('ProfileComponent initialized');
  }
}
