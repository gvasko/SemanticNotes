import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'lantor-navbar',
  standalone: false,
  
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(private authService: AuthService) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  getUserName(): string | undefined {
    return this.authService.getUserName();
  }
}
