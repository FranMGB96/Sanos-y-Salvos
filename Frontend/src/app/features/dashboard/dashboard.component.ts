import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ReportService } from '../../core/services/report.service';
import { Dashboard } from '../../core/models/report.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],

  template: `
    <div class="page">

      <!-- HEADER -->
      <div class="page-header">
        <h1>Inicio</h1>
        <p>Resumen del sistema Sanos y Salvos</p>
      </div>

      <!-- LOADING -->
      <div *ngIf="loading" class="loading">Cargando...</div>

      <ng-container *ngIf="!loading && dashboard">

        <!-- ESTADISTICAS -->
        <div class="stats-grid">

          <div class="stat-card blue">
            <div class="stat-icon">👤</div>
            <div class="stat-info">
              <span class="stat-value">{{ dashboard.totalUsuarios }}</span>
              <span class="stat-label">Usuarios</span>
            </div>
          </div>

          <div class="stat-card green">
            <div class="stat-icon">🐾</div>
            <div class="stat-info">
              <span class="stat-value">{{ dashboard.totalMascotas }}</span>
              <span class="stat-label">Mascotas</span>
            </div>
          </div>

          <div class="stat-card orange">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
              <span class="stat-value">{{ dashboard.reportesActivos }}</span>
              <span class="stat-label">Reportes Activos</span>
            </div>
          </div>

          <div class="stat-card red">
            <div class="stat-icon">🔍</div>
            <div class="stat-info">
              <span class="stat-value">{{ dashboard.reportesPerdidos }}</span>
              <span class="stat-label">Perdidos</span>
            </div>
          </div>

          <div class="stat-card teal">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <span class="stat-value">{{ dashboard.reportesEncontrados }}</span>
              <span class="stat-label">Encontrados</span>
            </div>
          </div>

        </div>

        <!-- BOTONES -->
        <div class="quick-actions">
          <a routerLink="/pets/new"    class="action-btn">+ Nueva Mascota</a>
          <a routerLink="/reports/new" class="action-btn secondary">+ Nuevo Reporte</a>
        </div>

        <!-- REPORTES -->
        <div class="section">

          <h2>Últimos Reportes</h2>

          <div class="reports-list" *ngIf="dashboard.ultimosReportes.length > 0; else noReports">

            <div class="report-card" *ngFor="let r of dashboard.ultimosReportes">

              <!-- TOP -->
              <div class="report-top">
                <div class="report-badge" [class]="r.tipo === 'PERDIDO' ? 'badge-red' : 'badge-green'">
                  {{ r.tipo }}
                </div>
                <div class="report-estado" [class]="'estado-' + r.estado?.toLowerCase()">
                  {{ r.estado }}
                </div>
              </div>

              <!-- TEXTO -->
              <div class="report-body">
                <p class="report-desc">{{ r.descripcion }}</p>
                <p class="report-pet" *ngIf="r.mascota">
                  🐾 {{ r.mascota.nombre }} ({{ r.mascota.especie }})
                </p>
                <p class="report-loc" *ngIf="r.ubicacionDescripcion">
                  📍 {{ r.ubicacionDescripcion }}
                </p>
              </div>

              <!-- IMAGENES -->
              <div class="report-images">
                <div class="pet-image-wrapper" *ngIf="r.mascota?.fotoUrl">
                  <img [src]="r.mascota?.fotoUrl" class="pet-image" alt="Mascota">
                </div>
                <div class="map-container" *ngIf="r.latitud && r.longitud">
                  <img [src]="getStaticMap(r.latitud, r.longitud)" class="map-image" alt="Mapa">
                  <div class="paw-marker"><span>🐾</span></div>
                </div>
              </div>

              <!-- CONTACTO -->
              <div class="contacto-box" *ngIf="r.telefonoReporter">
                <div class="contacto-label">📞 Contactar al dueño</div>
                <div class="contacto-info">
                  <span class="contacto-nombre" *ngIf="r.nombreReporter">{{ r.nombreReporter }}</span>
                  <a [href]="'tel:' + r.telefonoReporter" class="contacto-telefono">
                    {{ r.telefonoReporter }}
                  </a>
                  <!-- ✅ LOGO WHATSAPP -->
                  <a [href]="'https://wa.me/56' + r.telefonoReporter" target="_blank" class="btn-whatsapp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
              </div>

            </div>

          </div>

          <ng-template #noReports>
            <p class="empty">No hay reportes. <a routerLink="/reports/new">Crear uno</a></p>
          </ng-template>

        </div>

      </ng-container>

    </div>
  `,

  styles: [`
    .page{ padding:2rem; max-width:1200px; margin:0 auto; }

    .page-header{ margin-bottom:2rem; }
    .page-header h1{ font-size:2rem; color:#1a237e; margin:0 0 .3rem; }
    .page-header p { color:#666; margin:0; }

    .loading{ text-align:center; padding:3rem; color:#666; }

    .stats-grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
      gap:1rem;
      margin-bottom:1.5rem;
    }

    .stat-card{
      display:flex; align-items:center; gap:1rem;
      padding:1.25rem; border-radius:14px; color:white;
    }

    .stat-card.blue  { background:linear-gradient(135deg,#1a237e,#3949ab); }
    .stat-card.green { background:linear-gradient(135deg,#2e7d32,#43a047); }
    .stat-card.orange{ background:linear-gradient(135deg,#e65100,#fb8c00); }
    .stat-card.red   { background:linear-gradient(135deg,#b71c1c,#e53935); }
    .stat-card.teal  { background:linear-gradient(135deg,#00695c,#00897b); }

    .stat-icon { font-size:2rem; }
    .stat-value{ display:block; font-size:2rem; font-weight:700; line-height:1; }
    .stat-label{ font-size:.85rem; opacity:.9; }

    .quick-actions{ display:flex; gap:1rem; margin-bottom:2rem; }

    .action-btn{
      padding:.8rem 1.5rem; border-radius:10px; font-weight:600;
      text-decoration:none; font-size:.95rem; background:#1a237e; color:white;
    }

    .action-btn.secondary{
      background:white; color:#1a237e; border:2px solid #1a237e;
    }

    .section h2{ font-size:1.5rem; color:#222; margin-bottom:1rem; }

    .reports-list{ display:flex; flex-direction:column; gap:1rem; }

    .report-card{
      background:white; border-radius:18px; padding:1rem;
      box-shadow:0 2px 8px rgba(0,0,0,.06), 0 8px 20px rgba(0,0,0,.05);
      display:flex; flex-direction:column; gap:1rem;
    }

    .report-top{ display:flex; justify-content:space-between; align-items:flex-start; }

    .report-badge{
      padding:.35rem .9rem; border-radius:20px;
      font-size:.75rem; font-weight:700; white-space:nowrap;
    }

    .badge-red  { background:#ffebee; color:#c62828; }
    .badge-green{ background:#e8f5e9; color:#2e7d32; }

    .report-body{ display:flex; flex-direction:column; gap:.4rem; }

    .report-desc{ margin:0; font-size:1.05rem; color:#222; font-weight:600; line-height:1.4; }
    .report-pet { margin:0; font-size:.92rem; color:#555; }
    .report-loc { margin:0; font-size:.9rem;  color:#666; line-height:1.5; }

    .report-images{ display:flex; gap:1rem; flex-wrap:wrap; align-items:stretch; }

    .pet-image-wrapper{
      width:190px; height:140px;
      border-radius:16px; border:1px solid #e5e5e5;
      background:#f5f5f5; box-shadow:0 2px 8px rgba(0,0,0,.08);
      overflow:hidden; display:flex; align-items:center;
      justify-content:center; flex-shrink:0;
    }

    .pet-image{
      width:100%; height:100%;
      object-fit:contain; object-position:center;
      display:block; padding:4px; box-sizing:border-box;
    }

    .map-container{ position:relative; display:inline-block; flex-shrink:0; }

    .map-image{
      width:300px; height:140px; object-fit:cover;
      border-radius:16px; border:1px solid #dcdcdc;
      background:#f5f5f5; display:block;
      box-shadow:0 2px 8px rgba(0,0,0,.08);
    }

    .paw-marker{
      position:absolute; top:50%; left:50%;
      width:42px; height:42px;
      background:#ea4335; border-radius:50% 50% 50% 0;
      transform:translate(-50%, -100%) rotate(-45deg);
      border:3px solid white; box-shadow:0 3px 10px rgba(0,0,0,.35);
      display:flex; align-items:center; justify-content:center;
    }

    .paw-marker span{ transform:rotate(45deg); font-size:18px; line-height:1; }

    .contacto-box{
      background:#f0f7ff;
      border:1.5px solid #90caf9;
      border-radius:12px;
      padding:.9rem 1.1rem;
    }

    .contacto-label{
      font-size:.8rem;
      font-weight:700;
      color:#1565c0;
      margin-bottom:.5rem;
      text-transform:uppercase;
      letter-spacing:.04em;
    }

    .contacto-info{
      display:flex;
      align-items:center;
      gap:.75rem;
      flex-wrap:wrap;
    }

    .contacto-nombre{
      font-weight:600;
      color:#222;
      font-size:.95rem;
    }

    .contacto-telefono{
      color:#1a237e;
      font-weight:700;
      font-size:1rem;
      text-decoration:none;
    }

    .contacto-telefono:hover{ text-decoration:underline; }

    /* ✅ WHATSAPP LOGO */
    .btn-whatsapp{
      background:#25d366;
      border-radius:50%;
      width:36px; height:36px;
      display:flex; align-items:center; justify-content:center;
      text-decoration:none;
      flex-shrink:0;
      transition:background .2s;
    }

    .btn-whatsapp:hover{ background:#1da851; }

    .report-estado{
      font-size:.75rem; font-weight:700;
      padding:.35rem .8rem; border-radius:20px; white-space:nowrap;
    }

    .estado-activo  { background:#fff3cd; color:#f57f17; }
    .estado-resuelto{ background:#e8f5e9; color:#2e7d32; }
    .estado-cerrado { background:#f5f5f5; color:#757575; }

    .empty{ color:#999; font-size:.95rem; }

    @media(max-width:768px){
      .page{ padding:1rem; }
      .quick-actions{ flex-direction:column; }
      .action-btn{ text-align:center; }
      .report-images{ flex-direction:column; }
      .pet-image-wrapper{ width:100%; height:220px; }
      .map-image{ width:100%; height:220px; }
    }
  `]
})

export class DashboardComponent implements OnInit {

  dashboard: Dashboard | null = null;
  loading = true;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.reportService.getDashboard().subscribe({
      next: d => { this.dashboard = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  getStaticMap(lat: number, lng: number): string {
    return `https://maps.wikimedia.org/img/osm-intl,17,${lat},${lng},800x400.png`;
  }
}