import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PetService } from '../../core/services/pet.service';
import { ReportService } from '../../core/services/report.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">

      <div class="admin-header">
        <div>
          <h1>⚙️ Panel de Administración</h1>
          <p>Bienvenido, {{ currentUser?.nombre }} — <span class="badge-admin">ADMIN</span></p>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon">👥</span>
          <span class="stat-number">{{ usuarios.length }}</span>
          <span class="stat-label">Usuarios</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🐾</span>
          <span class="stat-number">{{ mascotas.length }}</span>
          <span class="stat-label">Mascotas</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📋</span>
          <span class="stat-number">{{ reportes.length }}</span>
          <span class="stat-label">Reportes</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🔴</span>
          <span class="stat-number">{{ reportesActivos }}</span>
          <span class="stat-label">Reportes Activos</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button [class.active]="tab === 'usuarios'" (click)="tab='usuarios'">👥 Usuarios</button>
        <button [class.active]="tab === 'mascotas'" (click)="tab='mascotas'">🐾 Mascotas</button>
        <button [class.active]="tab === 'reportes'" (click)="tab='reportes'">📋 Reportes</button>
      </div>

      <!-- Usuarios -->
      <div *ngIf="tab === 'usuarios'" class="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Registro</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of usuarios">
              <td>{{ u.id }}</td>
              <td>{{ u.nombre }}</td>
              <td>{{ u.email }}</td>
              <td><span class="badge" [class.badge-admin]="u.rol==='ADMIN'">{{ u.rol }}</span></td>
              <td><span class="badge" [class.badge-active]="u.active" [class.badge-inactive]="!u.active">{{ u.active ? 'Activo' : 'Inactivo' }}</span></td>
              <td>{{ u.createdAt | date:'dd/MM/yyyy' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mascotas -->
      <div *ngIf="tab === 'mascotas'" class="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Especie</th>
              <th>Raza</th>
              <th>Dueño ID</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of mascotas">
              <td>{{ p.id }}</td>
              <td>{{ p.nombre }}</td>
              <td>{{ p.especie }}</td>
              <td>{{ p.raza || '—' }}</td>
              <td>{{ p.ownerId }}</td>
              <td><span class="badge" [class.badge-active]="p.active">{{ p.active ? 'Activo' : 'Inactivo' }}</span></td>
              <td>
                <button class="btn-danger" (click)="eliminarMascota(p)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Reportes -->
      <div *ngIf="tab === 'reportes'" class="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Usuario ID</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of reportes">
              <td>{{ r.id }}</td>
              <td><span class="badge" [class.badge-perdido]="r.tipo==='PERDIDO'" [class.badge-encontrado]="r.tipo==='ENCONTRADO'">{{ r.tipo }}</span></td>
              <td class="desc">{{ r.descripcion }}</td>
              <td>{{ r.reporterUserId }}</td>
              <td>
                <select (change)="cambiarEstado(r, $event)">
                  <option value="ACTIVO"    [selected]="r.estado==='ACTIVO'">ACTIVO</option>
                  <option value="RESUELTO"  [selected]="r.estado==='RESUELTO'">RESUELTO</option>
                  <option value="CERRADO"   [selected]="r.estado==='CERRADO'">CERRADO</option>
                </select>
              </td>
              <td>{{ r.createdAt | date:'dd/MM/yyyy' }}</td>
              <td>
                <button class="btn-danger" (click)="eliminarReporte(r)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  `,
  styles: [`
    .page{ padding:5rem 2rem 2rem; max-width:1200px; margin:0 auto }
    .admin-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem }
    .admin-header h1{ font-size:1.8rem; color:#1a237e; margin:0 0 .25rem }
    .admin-header p{ color:#666; margin:0 }
    .badge-admin{ background:#ffc107; color:#333; padding:.2rem .6rem; border-radius:12px; font-size:.75rem; font-weight:700 }

    .stats-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:2rem }
    .stat-card{ background:white; border-radius:12px; padding:1.5rem; text-align:center; box-shadow:0 2px 10px rgba(0,0,0,.08); display:flex; flex-direction:column; gap:.25rem }
    .stat-icon{ font-size:2rem }
    .stat-number{ font-size:2rem; font-weight:700; color:#1a237e }
    .stat-label{ font-size:.85rem; color:#666 }

    .tabs{ display:flex; gap:.5rem; margin-bottom:1rem }
    .tabs button{ padding:.6rem 1.2rem; border:2px solid #e0e0e0; border-radius:8px; background:white; cursor:pointer; font-weight:600; font-size:.9rem; color:#666 }
    .tabs button.active{ background:#1a237e; color:white; border-color:#1a237e }

    .table-card{ background:white; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,.08); overflow:auto }
    table{ width:100%; border-collapse:collapse }
    th{ background:#f5f5f5; padding:.75rem 1rem; text-align:left; font-size:.8rem; color:#666; text-transform:uppercase; letter-spacing:.05em }
    td{ padding:.75rem 1rem; border-top:1px solid #f0f0f0; font-size:.9rem }
    tr:hover td{ background:#fafafa }
    .desc{ max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap }

    .badge{ padding:.2rem .6rem; border-radius:12px; font-size:.75rem; font-weight:600 }
    .badge-active{ background:#e8f5e9; color:#2e7d32 }
    .badge-inactive{ background:#ffebee; color:#c62828 }
    .badge-perdido{ background:#ffebee; color:#c62828 }
    .badge-encontrado{ background:#e8f5e9; color:#2e7d32 }

    select{ padding:.3rem .6rem; border-radius:6px; border:1px solid #ddd; font-size:.85rem }
    .btn-danger{ padding:.3rem .8rem; background:#ffebee; color:#c62828; border:none; border-radius:6px; cursor:pointer; font-size:.85rem; font-weight:600 }
    .btn-danger:hover{ background:#c62828; color:white }
  `]
})
export class AdminPanelComponent implements OnInit {

  tab = 'usuarios';
  usuarios: any[] = [];
  mascotas: any[] = [];
  reportes: any[] = [];

  get currentUser() { return this.auth.getCurrentUser(); }
  get reportesActivos() { return this.reportes.filter(r => r.estado === 'ACTIVO').length; }

  constructor(
    private auth: AuthService,
    private petService: PetService,
    private reportService: ReportService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // Redirigir si no es admin
    if (!this.auth.isAdmin()) {
      this.router.navigate(['/inicio']);
      return;
    }

    this.cargarDatos();
  }

  cargarDatos() {
    // Usuarios
    this.http.get<any[]>(`${environment.apiUrl}/users`).subscribe({
      next: (u) => this.usuarios = u,
      error: () => console.error('Error cargando usuarios')
    });

    // Mascotas
    this.petService.getAll().subscribe({
      next: (p) => this.mascotas = p,
      error: () => console.error('Error cargando mascotas')
    });

    // Reportes
    this.reportService.getAll().subscribe({
      next: (r) => this.reportes = r,
      error: () => console.error('Error cargando reportes')
    });
  }

  eliminarMascota(pet: any) {
    if (!confirm(`¿Eliminar a ${pet.nombre}?`)) return;
    this.petService.delete(pet.id).subscribe(() => {
      this.mascotas = this.mascotas.filter(p => p.id !== pet.id);
    });
  }

  eliminarReporte(reporte: any) {
    if (!confirm(`¿Eliminar reporte #${reporte.id}?`)) return;
    this.reportService.delete(reporte.id).subscribe(() => {
      this.reportes = this.reportes.filter(r => r.id !== reporte.id);
    });
  }

  cambiarEstado(reporte: any, event: any) {
    const nuevoEstado = event.target.value;
    this.reportService.updateEstado(reporte.id, nuevoEstado).subscribe({
      next: (r) => reporte.estado = r.estado,
      error: () => console.error('Error cambiando estado')
    });
  }
}