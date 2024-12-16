import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private http: HttpClient) { }

  sendForm() {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    console.log(email.value, password.value);

    // Attempt to login the user
    this.http.post<any>(environment.backend + '/users/login', {
      email: email.value,
      password: password.value,
    }, { observe: 'response' }).pipe().subscribe({
      next: (response: any) => {
        console.log(response);
        if (response && response.status === 200) {
          localStorage.setItem('user', JSON.stringify(response.body));
          window.location.href = '/';
        } else {
          alert('Nutzername bzw. Email bereits vergeben oder Passwörter stimmen nicht überein');
        }
      }, error: (error) => {
        if (error.status === 400 && error.error.message === 'User data not complete.') {
          alert('Es wurden nicht alle Felder ausgefüllt');
        } else if (error.status === 401 && error.error.message === 'Wrong credentials.') {
          alert('Falsche Anmeldedaten');
        }
      }
    });
  }
}
