import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <app-navbar *ngIf="auth.isLoggedIn()"></app-navbar>
    <main [class.with-nav]="auth.isLoggedIn()"><router-outlet></router-outlet></main>
  `,
  styles: [`main { min-height: 100vh; } main.with-nav { padding-top: 64px; }`]
})
export class AppComponent { constructor(public auth: AuthService) {} }
