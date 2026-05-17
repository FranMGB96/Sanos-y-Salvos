import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ReportService } from '../../../core/services/report.service';
import { ReporteConDetalle } from '../../../core/models/report.model';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, RouterLink],

  template: `
    <div class="page">

      <div class="page-header">
        <div>
          <h1>Reportes</h1>
          <p>{{ reportes.length }} reporte(s)</p>
        </div>
        <a routerLink="/reports/new" class="btn-primary">+ Nuevo Reporte</a>
      </div>

      <div class="filters">
        <button [class.active]="filtro === 'TODOS'"      (click)="setFiltro('TODOS')">Todos</button>
        <button [class.active]="filtro === 'PERDIDO'"    (click)="setFiltro('PERDIDO')">Perdidos</button>
        <button [class.active]="filtro === 'ENCONTRADO'" (click)="setFiltro('ENCONTRADO')">Encontrados</button>
      </div>

      <div *ngIf="loading" class="loading">Cargando reportes...</div>

      <div class="reports-list" *ngIf="!loading">

        <div class="report-card" *ngFor="let r of reportesFiltrados">

          <div class="report-header">
            <span class="badge" [class]="r.tipo === 'PERDIDO' ? 'badge-red' : 'badge-green'">
              {{ r.tipo === 'PERDIDO' ? '🔍 PERDIDO' : '✅ ENCONTRADO' }}
            </span>
            <span class="estado" [class]="'estado-' + r.estado?.toLowerCase()">
              {{ r.estado }}
            </span>
          </div>

          <div class="report-body">

            <!-- FOTO MASCOTA -->
            <img
              *ngIf="r.mascota?.fotoUrl"
              [src]="r.mascota?.fotoUrl"
              class="pet-image"
              [alt]="r.mascota?.nombre"
            >

            <p class="desc">{{ r.descripcion }}</p>

            <div class="mascota-info" *ngIf="r.mascota">
              <div>
                <strong>{{ r.mascota.nombre }}</strong>
                <span> · {{ r.mascota.especie }}</span>
              </div>
            </div>

            <p class="location" *ngIf="r.ubicacionDescripcion">
              📍 {{ r.ubicacionDescripcion }}
            </p>

            <!-- MAPA -->
            <div class="map-preview" *ngIf="r.latitud && r.longitud">
              <img
                [src]="getStaticMap(r.latitud, r.longitud)"
                class="report-map-image google-style-map"
                alt="Ubicación"
              >
              <div class="paw-marker">
                <span>🐾</span>
              </div>
            </div>

            <a
              *ngIf="r.latitud && r.longitud"
              [href]="'https://www.google.com/maps?q=' + r.latitud + ',' + r.longitud"
              target="_blank"
              class="map-link"
            >
              Ver ubicación completa
            </a>

            <!-- ✅ CONTACTO -->
            <div class="contacto-box" *ngIf="r.telefonoReporter">
              <div class="contacto-label">📞 Contactar al dueño</div>
              <div class="contacto-info">
                <span class="contacto-nombre" *ngIf="r.nombreReporter">{{ r.nombreReporter }}</span>
                <a [href]="'tel:' + r.telefonoReporter" class="contacto-telefono">
                  {{ r.telefonoReporter }}
                </a>
                <a [href]="'https://wa.me/56' + r.telefonoReporter" target="_blank" class="btn-whatsapp">
                  💬 WhatsApp
                </a>
              </div>
            </div>

            <p class="date" *ngIf="r.createdAt">
              🕐 {{ r.createdAt | date:'dd/MM/yyyy HH:mm' }}
            </p>

          </div>

          <div class="report-actions" *ngIf="r.estado === 'ACTIVO'">
            <button (click)="resolver(r)" class="btn-resolve">
              Marcar como Resuelto
            </button>
          </div>

        </div>

      </div>

    </div>
  `,

  styles: [`
    .page{
      padding:2rem;
      max-width:950px;
      margin:0 auto;
    }

    .page-header{
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      margin-bottom:1.5rem;
    }

    .page-header h1{ font-size:1.8rem; color:#1a237e; margin:0 0 .25rem; }
    .page-header p { color:#666; margin:0; font-size:.9rem; }

    .btn-primary{
      background:#1a237e; color:white; padding:.7rem 1.4rem;
      border-radius:8px; text-decoration:none; font-weight:600; font-size:.9rem;
    }

    .filters{ display:flex; gap:.5rem; margin-bottom:1.5rem; }

    .filters button{
      padding:.45rem 1.1rem; border-radius:20px; border:2px solid #ddd;
      background:white; color:#666; cursor:pointer; font-size:.85rem; font-weight:600;
    }

    .filters button.active{ background:#1a237e; color:white; border-color:#1a237e; }

    .loading{ text-align:center; padding:3rem; color:#666; }

    .reports-list{ display:flex; flex-direction:column; gap:1rem; }

    .report-card{
      background:white; border-radius:16px; overflow:hidden;
      box-shadow:0 2px 10px rgba(0,0,0,.08);
    }

    .report-header{
      display:flex; justify-content:space-between; align-items:center;
      padding:1rem 1.25rem; background:#f8f9ff; border-bottom:1px solid #eee;
    }

    .badge{ padding:.35rem .9rem; border-radius:20px; font-size:.82rem; font-weight:700; }
    .badge-red  { background:#ffebee; color:#c62828; }
    .badge-green{ background:#e8f5e9; color:#2e7d32; }

    .estado{ font-size:.75rem; font-weight:700; padding:.25rem .7rem; border-radius:12px; }
    .estado-activo  { background:#fff9c4; color:#f57f17; }
    .estado-resuelto{ background:#e8f5e9; color:#2e7d32; }

    .report-body{ padding:1.25rem; }

    .pet-image{
      width:100%; height:340px;
      object-fit:contain; background:#f5f5f5;
      border-radius:14px; margin-bottom:1rem;
      padding:.5rem; display:block;
    }

    .desc{ margin:0 0 1rem; color:#333; font-size:1rem; line-height:1.5; }

    .mascota-info{
      padding:.8rem 1rem; background:#f8f9ff;
      border-radius:10px; margin-bottom:1rem;
    }

    .mascota-info strong{ font-size:1rem; color:#1a237e; }
    .mascota-info span  { color:#666; font-size:.9rem; }

    .location{ margin:.5rem 0 1rem; font-size:.9rem; color:#666; }

    /* MAPA */
    .map-preview{
      position:relative; width:100%; margin-bottom:1rem; overflow:hidden;
      border-radius:14px; border:1px solid #d8d8d8; background:#f2f2f2;
      box-shadow:0 1px 2px rgba(0,0,0,.08), 0 3px 8px rgba(0,0,0,.12);
    }

    .report-map-image{ width:100%; height:280px; object-fit:cover; display:block; }

    .google-style-map{ filter:brightness(1.04) contrast(.96) saturate(.82); }

    .paw-marker{
      position:absolute; top:50%; left:50%;
      width:42px; height:42px;
      background:#ea4335; border-radius:50% 50% 50% 0;
      transform:translate(-50%, -100%) rotate(-45deg);
      border:3px solid white; box-shadow:0 3px 10px rgba(0,0,0,.35);
      display:flex; align-items:center; justify-content:center;
    }

    .paw-marker span{ transform:rotate(45deg); font-size:18px; line-height:1; }

    .map-link{
      display:inline-block; margin-bottom:1rem;
      color:#1a237e; font-weight:600; text-decoration:none;
    }

    .map-link:hover{ text-decoration:underline; }

    /* ✅ CONTACTO */
    .contacto-box{
      background:#f0f7ff;
      border:1.5px solid #90caf9;
      border-radius:12px;
      padding:.9rem 1.1rem;
      margin-bottom:1rem;
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

    .btn-whatsapp{
      background:#25d366;
      color:white;
      border-radius:8px;
      padding:.35rem .85rem;
      font-size:.82rem;
      font-weight:700;
      text-decoration:none;
      transition:background .2s;
    }

    .btn-whatsapp:hover{ background:#1da851; }

    .date{ color:#777; font-size:.82rem; }

    .report-actions{ padding:1rem 1.25rem; border-top:1px solid #eee; }

    .btn-resolve{
      background:#e8f5e9; color:#2e7d32; border:none;
      padding:.6rem 1.2rem; border-radius:8px;
      font-size:.9rem; font-weight:700; cursor:pointer;
    }
  `]
})

export class ReportListComponent implements OnInit {

  reportes: ReporteConDetalle[] = [];
  filtro = 'TODOS';
  loading = true;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.reportService.getReportesConDetalle().subscribe({
      next: r => {
        this.reportes = r.sort((a, b) =>
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get reportesFiltrados() {
    return this.filtro === 'TODOS'
      ? this.reportes
      : this.reportes.filter(r => r.tipo === this.filtro);
  }

  setFiltro(f: string) { this.filtro = f; }

  resolver(r: ReporteConDetalle) {
    this.reportService.updateEstado(r.id!, 'RESUELTO').subscribe(() => {
      r.estado = 'RESUELTO';
    });
  }

  getStaticMap(lat: number, lng: number): string {
    return `https://maps.wikimedia.org/img/osm-intl,15,${lat},${lng},800x400.png`;
  }
}