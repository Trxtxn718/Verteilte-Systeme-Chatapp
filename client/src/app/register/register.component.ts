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

    console.log(username.value, email.value, password.value, passwordRepeat.value);

    this.http.post<any>('http://localhost:8080/users/register', {
      username: username.value,
      email: email.value,
      password: password.value,
      passwordRepeat: passwordRepeat.value
    }).subscribe((response: any) => {
      console.log(response);
    });

    // this.http.post<any>('http://localhost:8080/users/register',{
    //   username: username.value,
    //   email: email.value,
    //   password: password.value,
    //   passwordRepeat: passwordRepeat.value
    // }).subscribe((response: any) => {
    //   console.log(response);
    // });
  }
}
