import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register', standalone: true, imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header"><span class="logo">🐾</span><h1>Crear Cuenta</h1><p>Únete a Sanos y Salvos</p></div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="field"><label>Nombre completo</label><input type="text" formControlName="nombre" placeholder="Tu nombre"></div>
          <div class="field"><label>Email</label><input type="email" formControlName="email" placeholder="tu@email.com"></div>
          <div class="field"><label>Contraseña</label><input type="password" formControlName="password" placeholder="Mínimo 6 caracteres"></div>
          <div class="field"><label>Tipo de cuenta</label>
            <select formControlName="rol">
              <option value="OWNER">Dueño de mascota</option>
              <option value="CITIZEN">Ciudadano</option>
              <option value="ORG">Organización rescatista</option>
            </select>
          </div>
          <div class="alert" *ngIf="errorMsg">{{ errorMsg }}</div>
          <button type="submit" [disabled]="loading">{{ loading ? 'Registrando...' : 'Registrarse' }}</button>
        </form>
        <p class="footer-link">¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
      </div>
    </div>`,
  styles: [`.auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a237e 0%,#283593 100%)}.auth-card{background:white;border-radius:16px;padding:2.5rem;width:100%;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,.2)}.auth-header{text-align:center;margin-bottom:2rem}.logo{font-size:3rem}h1{margin:.5rem 0 .25rem;color:#1a237e;font-size:1.6rem}.auth-header p{color:#666;font-size:.9rem}.field{margin-bottom:1.2rem}label{display:block;font-size:.85rem;font-weight:600;color:#333;margin-bottom:.4rem}input,select{width:100%;padding:.75rem 1rem;border:1.5px solid #ddd;border-radius:8px;font-size:.95rem;box-sizing:border-box;outline:none;background:white;transition:border .2s}input:focus,select:focus{border-color:#1a237e}.alert{background:#ffebee;color:#c62828;border-radius:8px;padding:.75rem 1rem;font-size:.85rem;margin-bottom:1rem}button{width:100%;padding:.85rem;background:#1a237e;color:white;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer}button:disabled{opacity:.6}.footer-link{text-align:center;margin-top:1.5rem;font-size:.9rem;color:#666}.footer-link a{color:#1a237e;font-weight:600}`]
})
export class RegisterComponent {
  form: FormGroup; loading = false; errorMsg = '';
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({ nombre: ['', Validators.required], email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(6)]], rol: ['OWNER'] });
  }
  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.errorMsg = '';
    this.auth.register(this.form.value).subscribe({ next: () => this.router.navigate(['/dashboard']), error: (e: any) => { this.errorMsg = e.error?.message || 'Error al registrar.'; this.loading = false; } });
  }
}
