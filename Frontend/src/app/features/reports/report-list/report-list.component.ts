import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../../core/services/report.service';
import { ReporteConDetalle } from '../../../core/models/report.model';

@Component({
  selector: 'app-report-list', standalone: true, imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header"><div><h1>Reportes</h1><p>{{reportes.length}} reporte(s)</p></div><a routerLink="/reports/new" class="btn-primary">+ Nuevo Reporte</a></div>
      <div class="filters">
        <button [class.active]="filtro==='TODOS'" (click)="setFiltro('TODOS')">Todos</button>
        <button [class.active]="filtro==='PERDIDO'" (click)="setFiltro('PERDIDO')">Perdidos</button>
        <button [class.active]="filtro==='ENCONTRADO'" (click)="setFiltro('ENCONTRADO')">Encontrados</button>
      </div>
      <div *ngIf="loading" class="loading">Cargando reportes...</div>
      <div class="reports-list" *ngIf="!loading">
        <div class="report-card" *ngFor="let r of reportesFiltrados">
          <div class="report-header">
            <span class="badge" [class]="r.tipo==='PERDIDO'?'badge-red':'badge-green'">{{r.tipo==='PERDIDO'?'🔍 PERDIDO':'✅ ENCONTRADO'}}</span>
            <span class="estado" [class]="'estado-'+r.estado?.toLowerCase()">{{r.estado}}</span>
          </div>
          <div class="report-body">
            <p class="desc">{{r.descripcion}}</p>
            <div class="mascota-info" *ngIf="r.mascota">
              <img *ngIf="r.mascota.fotoUrl" [src]="r.mascota.fotoUrl" [alt]="r.mascota.nombre">
              <span *ngIf="!r.mascota.fotoUrl" class="mascota-emoji">{{r.mascota.especie==='gato'?'🐱':'🐶'}}</span>
              <div><strong>{{r.mascota.nombre}}</strong><span> · {{r.mascota.especie}}</span></div>
            </div>
            <p class="location" *ngIf="r.ubicacionDescripcion">📍 {{r.ubicacionDescripcion}}</p>
            <p class="date" *ngIf="r.createdAt">🕐 {{r.createdAt | date:'dd/MM/yyyy HH:mm'}}</p>
          </div>
          <div class="report-actions" *ngIf="r.estado==='ACTIVO'">
            <button (click)="resolver(r)" class="btn-resolve">Marcar como Resuelto</button>
          </div>
        </div>
        <div class="empty-state" *ngIf="reportesFiltrados.length===0"><span>📋</span><p>No hay reportes con este filtro</p></div>
      </div>
    </div>`,
  styles: [`.page{padding:2rem;max-width:900px;margin:0 auto}.page-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem}.page-header h1{font-size:1.8rem;color:#1a237e;margin:0 0 .25rem}.page-header p{color:#666;margin:0;font-size:.9rem}.btn-primary{background:#1a237e;color:white;padding:.7rem 1.4rem;border-radius:8px;text-decoration:none;font-weight:600;font-size:.9rem}.filters{display:flex;gap:.5rem;margin-bottom:1.5rem}.filters button{padding:.45rem 1.1rem;border-radius:20px;border:2px solid #ddd;background:white;color:#666;cursor:pointer;font-size:.85rem;font-weight:600;transition:all .2s}.filters button.active{background:#1a237e;color:white;border-color:#1a237e}.loading{text-align:center;padding:3rem;color:#666}.reports-list{display:flex;flex-direction:column;gap:1rem}.report-card{background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.07)}.report-header{display:flex;justify-content:space-between;align-items:center;padding:.75rem 1.25rem;background:#f8f9ff;border-bottom:1px solid #eee}.badge{padding:.3rem .8rem;border-radius:20px;font-size:.8rem;font-weight:700}.badge-red{background:#ffebee;color:#c62828}.badge-green{background:#e8f5e9;color:#2e7d32}.estado{font-size:.75rem;font-weight:600;padding:.2rem .6rem;border-radius:12px}.estado-activo{background:#fff9c4;color:#f57f17}.estado-resuelto{background:#e8f5e9;color:#2e7d32}.estado-cerrado{background:#f5f5f5;color:#757575}.report-body{padding:1rem 1.25rem}.desc{margin:0 0 .75rem;color:#333;font-size:.95rem}.mascota-info{display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem;padding:.6rem;background:#f8f9ff;border-radius:8px}.mascota-info img{width:40px;height:40px;border-radius:50%;object-fit:cover}.mascota-emoji{font-size:1.8rem}.mascota-info strong{font-size:.9rem;color:#1a237e}.mascota-info span{font-size:.82rem;color:#666}.location,.date{margin:.3rem 0 0;font-size:.82rem;color:#777}.report-actions{padding:.75rem 1.25rem;border-top:1px solid #f0f0f0}.btn-resolve{background:#e8f5e9;color:#2e7d32;border:none;padding:.4rem 1rem;border-radius:6px;font-size:.85rem;font-weight:600;cursor:pointer}.empty-state{text-align:center;padding:3rem}.empty-state span{font-size:3rem;display:block;margin-bottom:1rem}.empty-state p{color:#999}`]
})
export class ReportListComponent implements OnInit {
  reportes: ReporteConDetalle[] = []; filtro = 'TODOS'; loading = true;
  constructor(private reportService: ReportService) {}
  ngOnInit() { this.reportService.getReportesConDetalle().subscribe({ next: r => { this.reportes = r; this.loading = false; }, error: () => this.loading = false }); }
  get reportesFiltrados() { return this.filtro === 'TODOS' ? this.reportes : this.reportes.filter(r => r.tipo === this.filtro); }
  setFiltro(f: string) { this.filtro = f; }
  resolver(r: ReporteConDetalle) { this.reportService.updateEstado(r.id!, 'RESUELTO').subscribe(() => { r.estado = 'RESUELTO'; }); }
}
