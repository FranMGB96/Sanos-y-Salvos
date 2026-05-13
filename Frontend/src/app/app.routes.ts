import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login',    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'pets',      canActivate: [authGuard], loadComponent: () => import('./features/pets/pet-list/pet-list.component').then(m => m.PetListComponent) },
  { path: 'pets/new',  canActivate: [authGuard], loadComponent: () => import('./features/pets/pet-form/pet-form.component').then(m => m.PetFormComponent) },
  { path: 'pets/edit/:id', canActivate: [authGuard], loadComponent: () => import('./features/pets/pet-form/pet-form.component').then(m => m.PetFormComponent) },
  { path: 'reports',   canActivate: [authGuard], loadComponent: () => import('./features/reports/report-list/report-list.component').then(m => m.ReportListComponent) },
  { path: 'reports/new', canActivate: [authGuard], loadComponent: () => import('./features/reports/report-form/report-form.component').then(m => m.ReportFormComponent) },
  { path: 'nosotros',   loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent) },
  { path: '**', redirectTo: 'dashboard' },
];
