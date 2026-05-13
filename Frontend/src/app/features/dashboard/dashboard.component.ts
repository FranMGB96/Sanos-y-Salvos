import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../core/services/report.service';
import { Dashboard } from '../../core/models/report.model';

@Component({
  selector: 'app-dashboard', standalone: true, imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header"><h1>Dashboard</h1><p>Resumen del sistema Sanos y Salvos</p></div>
      <div *ngIf="loading" class="loading">Cargando...</div>
      <ng-container *ngIf="!loading && dashboard">
        <div class="stats-grid">
          <div class="stat-card blue"><div class="stat-icon">👤</div><div class="stat-info"><span class="stat-value">{{dashboard.totalUsuarios}}</span><span class="stat-label">Usuarios</span></div></div>
          <div class="stat-card green"><div class="stat-icon">🐾</div><div class="stat-info"><span class="stat-value">{{dashboard.totalMascotas}}</span><span class="stat-label">Mascotas</span></div></div>
          <div class="stat-card orange"><div class="stat-icon">📋</div><div class="stat-info"><span class="stat-value">{{dashboard.reportesActivos}}</span><span class="stat-label">Reportes Activos</span></div></div>
          <div class="stat-card red"><div class="stat-icon">🔍</div><div class="stat-info"><span class="stat-value">{{dashboard.reportesPerdidos}}</span><span class="stat-label">Perdidos</span></div></div>
          <div class="stat-card teal"><div class="stat-icon">✅</div><div class="stat-info"><span class="stat-value">{{dashboard.reportesEncontrados}}</span><span class="stat-label">Encontrados</span></div></div>
        </div>
        <div class="quick-actions">
          <a routerLink="/pets/new" class="action-btn">+ Nueva Mascota</a>
          <a routerLink="/reports/new" class="action-btn secondary">+ Nuevo Reporte</a>
        </div>
        <div class="section">
          <h2>Últimos Reportes</h2>
          <div class="reports-list" *ngIf="dashboard.ultimosReportes.length > 0; else noReports">
            <div class="report-card" *ngFor="let r of dashboard.ultimosReportes">
              <div class="report-badge" [class]="r.tipo==='PERDIDO'?'badge-red':'badge-green'">{{r.tipo}}</div>
              <div class="report-body">
                <p class="report-desc">{{r.descripcion}}</p>
                <p class="report-pet" *ngIf="r.mascota">🐾 {{r.mascota.nombre}} ({{r.mascota.especie}})</p>
                <p class="report-loc" *ngIf="r.ubicacionDescripcion">📍 {{r.ubicacionDescripcion}}</p>
              </div>
              <div class="report-estado" [class]="'estado-'+r.estado?.toLowerCase()">{{r.estado}}</div>
            </div>
          </div>
          <ng-template #noReports><p class="empty">No hay reportes. <a routerLink="/reports/new">Crear uno</a></p></ng-template>
        </div>
      </ng-container>
    </div>`,
  styles: [`.page{padding:2rem;max-width:1100px;margin:0 auto}.page-header{margin-bottom:2rem}.page-header h1{font-size:1.8rem;color:#1a237e;margin:0 0 .25rem}.page-header p{color:#666;margin:0}.loading{text-align:center;padding:3rem;color:#666}.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:1.5rem}.stat-card{display:flex;align-items:center;gap:1rem;padding:1.25rem;border-radius:12px;color:white}.stat-card.blue{background:linear-gradient(135deg,#1a237e,#3949ab)}.stat-card.green{background:linear-gradient(135deg,#2e7d32,#43a047)}.stat-card.orange{background:linear-gradient(135deg,#e65100,#fb8c00)}.stat-card.red{background:linear-gradient(135deg,#b71c1c,#e53935)}.stat-card.teal{background:linear-gradient(135deg,#00695c,#00897b)}.stat-icon{font-size:2rem}.stat-value{display:block;font-size:2rem;font-weight:700;line-height:1}.stat-label{font-size:.8rem;opacity:.85}.quick-actions{display:flex;gap:1rem;margin-bottom:2rem}.action-btn{padding:.75rem 1.5rem;border-radius:8px;font-weight:600;text-decoration:none;font-size:.95rem;background:#1a237e;color:white}.action-btn.secondary{background:white;color:#1a237e;border:2px solid #1a237e}.section h2{font-size:1.2rem;color:#333;margin-bottom:1rem}.reports-list{display:flex;flex-direction:column;gap:.75rem}.report-card{display:flex;align-items:flex-start;gap:1rem;background:white;border-radius:10px;padding:1rem 1.25rem;box-shadow:0 2px 8px rgba(0,0,0,.06)}.report-badge{padding:.25rem .75rem;border-radius:20px;font-size:.75rem;font-weight:700;white-space:nowrap}.badge-red{background:#ffebee;color:#c62828}.badge-green{background:#e8f5e9;color:#2e7d32}.report-body{flex:1}.report-desc{margin:0 0 .25rem;font-size:.9rem;color:#333}.report-pet,.report-loc{margin:0;font-size:.8rem;color:#666}.report-estado{font-size:.75rem;font-weight:600;padding:.2rem .6rem;border-radius:12px;white-space:nowrap}.estado-activo{background:#fff9c4;color:#f57f17}.estado-resuelto{background:#e8f5e9;color:#2e7d32}.estado-cerrado{background:#f5f5f5;color:#757575}.empty{color:#999;font-size:.9rem}`]
})
export class DashboardComponent implements OnInit {
  dashboard: Dashboard | null = null; loading = true;
  constructor(private reportService: ReportService) {}
  ngOnInit() { this.reportService.getDashboard().subscribe({ next: d => { this.dashboard = d; this.loading = false; }, error: () => this.loading = false }); }
}
