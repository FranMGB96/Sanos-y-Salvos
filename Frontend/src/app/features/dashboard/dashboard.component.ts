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
      <div *ngIf="loading" class="loading">
        Cargando...
      </div>

      <ng-container *ngIf="!loading && dashboard">

        <!-- ESTADISTICAS -->
        <div class="stats-grid">

          <div class="stat-card blue">
            <div class="stat-icon">👤</div>

            <div class="stat-info">
              <span class="stat-value">
                {{ dashboard.totalUsuarios }}
              </span>

              <span class="stat-label">
                Usuarios
              </span>
            </div>
          </div>

          <div class="stat-card green">
            <div class="stat-icon">🐾</div>

            <div class="stat-info">
              <span class="stat-value">
                {{ dashboard.totalMascotas }}
              </span>

              <span class="stat-label">
                Mascotas
              </span>
            </div>
          </div>

          <div class="stat-card orange">
            <div class="stat-icon">📋</div>

            <div class="stat-info">
              <span class="stat-value">
                {{ dashboard.reportesActivos }}
              </span>

              <span class="stat-label">
                Reportes Activos
              </span>
            </div>
          </div>

          <div class="stat-card red">
            <div class="stat-icon">🔍</div>

            <div class="stat-info">
              <span class="stat-value">
                {{ dashboard.reportesPerdidos }}
              </span>

              <span class="stat-label">
                Perdidos
              </span>
            </div>
          </div>

          <div class="stat-card teal">
            <div class="stat-icon">✅</div>

            <div class="stat-info">
              <span class="stat-value">
                {{ dashboard.reportesEncontrados }}
              </span>

              <span class="stat-label">
                Encontrados
              </span>
            </div>
          </div>

        </div>

        <!-- BOTONES -->
        <div class="quick-actions">

          <a
            routerLink="/pets/new"
            class="action-btn"
          >
            + Nueva Mascota
          </a>

          <a
            routerLink="/reports/new"
            class="action-btn secondary"
          >
            + Nuevo Reporte
          </a>

        </div>

        <!-- REPORTES -->
        <div class="section">

          <h2>Últimos Reportes</h2>

          <div
            class="reports-list"
            *ngIf="dashboard.ultimosReportes.length > 0; else noReports"
          >

            <div
              class="report-card"
              *ngFor="let r of dashboard.ultimosReportes"
            >

              <!-- TOP -->
              <div class="report-top">

                <div
                  class="report-badge"
                  [class]="r.tipo === 'PERDIDO'
                    ? 'badge-red'
                    : 'badge-green'"
                >
                  {{ r.tipo }}
                </div>

                <div
                  class="report-estado"
                  [class]="'estado-' + r.estado?.toLowerCase()"
                >
                  {{ r.estado }}
                </div>

              </div>

              <!-- TEXTO -->
              <div class="report-body">

                <p class="report-desc">
                  {{ r.descripcion }}
                </p>

                <p
                  class="report-pet"
                  *ngIf="r.mascota"
                >
                  🐾
                  {{ r.mascota.nombre }}
                  ({{ r.mascota.especie }})
                </p>

                <p
                  class="report-loc"
                  *ngIf="r.ubicacionDescripcion"
                >
                  📍 {{ r.ubicacionDescripcion }}
                </p>

              </div>

              <!-- IMAGENES -->
              <div class="report-images">

                <!-- FOTO -->
                <img
                  *ngIf="r.mascota?.fotoUrl"
                  [src]="r.mascota?.fotoUrl"
                  class="pet-image"
                  alt="Mascota"
                >

                <!-- MAPA -->
                <div
                  class="map-container"
                  *ngIf="r.latitud && r.longitud"
                >

                  <img
                    [src]="getStaticMap(r.latitud, r.longitud)"
                    class="map-image"
                    alt="Mapa"
                  >

                  <!-- PIN -->
                  <div class="map-pin">
                    📍
                  </div>

                </div>

              </div>

            </div>

          </div>

          <ng-template #noReports>

            <p class="empty">
              No hay reportes.
              <a routerLink="/reports/new">
                Crear uno
              </a>
            </p>

          </ng-template>

        </div>

      </ng-container>

    </div>
  `,

  styles: [`

    .page{
      padding:2rem;
      max-width:1200px;
      margin:0 auto;
    }

    .page-header{
      margin-bottom:2rem;
    }

    .page-header h1{
      font-size:2rem;
      color:#1a237e;
      margin:0 0 .3rem;
    }

    .page-header p{
      color:#666;
      margin:0;
    }

    .loading{
      text-align:center;
      padding:3rem;
      color:#666;
    }

    /* STATS */

    .stats-grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
      gap:1rem;
      margin-bottom:1.5rem;
    }

    .stat-card{
      display:flex;
      align-items:center;
      gap:1rem;
      padding:1.25rem;
      border-radius:14px;
      color:white;
    }

    .stat-card.blue{
      background:linear-gradient(135deg,#1a237e,#3949ab);
    }

    .stat-card.green{
      background:linear-gradient(135deg,#2e7d32,#43a047);
    }

    .stat-card.orange{
      background:linear-gradient(135deg,#e65100,#fb8c00);
    }

    .stat-card.red{
      background:linear-gradient(135deg,#b71c1c,#e53935);
    }

    .stat-card.teal{
      background:linear-gradient(135deg,#00695c,#00897b);
    }

    .stat-icon{
      font-size:2rem;
    }

    .stat-value{
      display:block;
      font-size:2rem;
      font-weight:700;
      line-height:1;
    }

    .stat-label{
      font-size:.85rem;
      opacity:.9;
    }

    /* BOTONES */

    .quick-actions{
      display:flex;
      gap:1rem;
      margin-bottom:2rem;
    }

    .action-btn{
      padding:.8rem 1.5rem;
      border-radius:10px;
      font-weight:600;
      text-decoration:none;
      font-size:.95rem;
      background:#1a237e;
      color:white;
    }

    .action-btn.secondary{
      background:white;
      color:#1a237e;
      border:2px solid #1a237e;
    }

    /* SECTION */

    .section h2{
      font-size:1.5rem;
      color:#222;
      margin-bottom:1rem;
    }

    .reports-list{
      display:flex;
      flex-direction:column;
      gap:1rem;
    }

    /* CARD */

    .report-card{
      background:white;

      border-radius:18px;

      padding:1rem;

      box-shadow:
        0 2px 8px rgba(0,0,0,.06),
        0 8px 20px rgba(0,0,0,.05);

      display:flex;
      flex-direction:column;
      gap:1rem;
    }

    /* TOP */

    .report-top{
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
    }

    .report-badge{
      padding:.35rem .9rem;
      border-radius:20px;
      font-size:.75rem;
      font-weight:700;
      white-space:nowrap;
    }

    .badge-red{
      background:#ffebee;
      color:#c62828;
    }

    .badge-green{
      background:#e8f5e9;
      color:#2e7d32;
    }

    /* BODY */

    .report-body{
      display:flex;
      flex-direction:column;
      gap:.4rem;
    }

    .report-desc{
      margin:0;
      font-size:1.05rem;
      color:#222;
      font-weight:600;
      line-height:1.4;
    }

    .report-pet{
      margin:0;
      font-size:.92rem;
      color:#555;
    }

    .report-loc{
      margin:0;
      font-size:.9rem;
      color:#666;
      line-height:1.5;
    }

    /* IMAGENES */

    .report-images{
      display:flex;
      gap:1rem;
      flex-wrap:wrap;
      align-items:center;
    }

    /* FOTO */

    .pet-image{
      width:190px;
      height:140px;

      object-fit:cover;
      object-position:center center;

      border-radius:16px;

      border:1px solid #e5e5e5;

      background:#f5f5f5;

      display:block;

      box-shadow:0 2px 8px rgba(0,0,0,.08);
    }

    /* MAPA */

    .map-container{
      position:relative;
      display:inline-block;
    }

    .map-image{
      width:300px;
      height:140px;

      object-fit:cover;

      border-radius:16px;

      border:1px solid #dcdcdc;

      background:#f5f5f5;

      display:block;

      box-shadow:0 2px 8px rgba(0,0,0,.08);
    }

    /* PIN */

    .map-pin{
      position:absolute;

      top:50%;
      left:50%;

      transform:translate(-50%, -100%);

      font-size:2rem;

      filter:drop-shadow(0 3px 6px rgba(0,0,0,.35));

      pointer-events:none;
    }

    /* ESTADO */

    .report-estado{
      font-size:.75rem;
      font-weight:700;
      padding:.35rem .8rem;
      border-radius:20px;
      white-space:nowrap;
    }

    .estado-activo{
      background:#fff3cd;
      color:#f57f17;
    }

    .estado-resuelto{
      background:#e8f5e9;
      color:#2e7d32;
    }

    .estado-cerrado{
      background:#f5f5f5;
      color:#757575;
    }

    .empty{
      color:#999;
      font-size:.95rem;
    }

    /* MOBILE */

    @media(max-width:768px){

      .page{
        padding:1rem;
      }

      .quick-actions{
        flex-direction:column;
      }

      .action-btn{
        text-align:center;
      }

      .report-images{
        flex-direction:column;
      }

      .pet-image,
      .map-image{
        width:100%;
        height:220px;
      }

    }

  `]
})

export class DashboardComponent implements OnInit {

  dashboard: Dashboard | null = null;

  loading = true;

  constructor(
    private reportService: ReportService
  ) {}

  ngOnInit() {

    this.reportService
      .getDashboard()
      .subscribe({

        next: d => {

          this.dashboard = d;
          this.loading = false;
        },

        error: () => {

          this.loading = false;
        }
      });
  }

  // MAPA ESTATICO CON MAS ZOOM
  getStaticMap(
    lat: number,
    lng: number
  ): string {

    return `https://maps.wikimedia.org/img/osm-intl,17,${lat},${lng},800x400.png`;
  }
}