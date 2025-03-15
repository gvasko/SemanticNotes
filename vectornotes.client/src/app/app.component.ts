import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private myAuthService: AuthService
  ) { }

  ngOnInit() {
    this.myAuthService.init();
  }

  ngOnDestroy(): void {
    this.myAuthService.destroy();
  }
}

