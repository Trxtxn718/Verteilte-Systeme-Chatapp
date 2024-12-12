import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private http: HttpClient) { }

  sendForm() {
    const username = document.getElementById('username') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const passwordRepeat = document.getElementById('passwordRepeat') as HTMLInputElement;

    this.http.post<any>('http://localhost:8080/users/register', {
      username: username.value,
      email: email.value,
      password: password.value,
      passwordRepeat: passwordRepeat.value
    }, { observe: 'response' }).pipe().subscribe({
      next: (response: any) => {
        console.log(response);
        if (response && response.status === 201) {
          localStorage.setItem('user', JSON.stringify(response.body));
          window.location.href = '/';
        } else {
          alert('Nutzername bzw. Email bereits vergeben oder Passwörter stimmen nicht überein');
        }
      }, error: (error) => {
        if (error.status === 400 && error.error.message === 'User data not complete.') {
          alert('Es wurden nicht alle Felder ausgefüllt');
        } else if (error.status === 400 && error.error.message === 'Passwords do not match.') {
          alert('Passwörter stimmen nicht überein');
        } else if (error.status === 409 && error.error.message === 'User already exists.') {
          alert('Nutzername bzw. Email bereits vergeben');
        }
      }
    });
  }
}
