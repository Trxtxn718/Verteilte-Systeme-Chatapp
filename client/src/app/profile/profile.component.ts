import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  ngOnInit() {
    fetch('/api/profile')
      .then(response => response.json())
      .then(data => {

      }).catch(error => { console.log(error); });

    console.log('ProfileComponent initialized');
  }
}
