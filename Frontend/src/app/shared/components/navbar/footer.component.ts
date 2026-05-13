import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="logo">🐾</span>
          <span class="title">Sanos y Salvos</span>
        </div>
        <p class="tagline">Ayudando a que cada mascota encuentre el camino a casa.</p>
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} Todos los derechos reservados</p>
        </div>
      </div>
    </footer>`,
  styles: [`
    .footer {
      background: #1a237e; /* El mismo azul de tu Navbar */
      color: white;        /* Cambiamos el texto a blanco para que se lea bien */
      padding: 2rem 0 1rem 0;
      margin-top: 4rem;
      width: 100%;
      box-shadow: 0 -2px 8px rgba(0,0,0,.2); /* Sombra invertida hacia arriba */
    }
    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .footer-brand .title {
      font-weight: 700;
      color: white; /* Título en blanco */
    }
    .tagline {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8); /* Blanco con un poco de transparencia */
      margin-bottom: 1rem;
    }
    .footer-bottom {
      width: 80%;
      border-top: 1px solid rgba(255, 255, 255, 0.1); /* Línea divisoria sutil */
      padding-top: 1rem;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}