import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="landing-page">
      <div class="hero-panel">
        <div class="hero-copy">
          <p class="eyebrow">FixFlow · Software para técnicos</p>
          <h1>Tu taller, más ordenado, más rápido y más rentable.</h1>
          <p class="hero-text">
            Centralizá clientes, órdenes, presupuestos y seguimiento de reparaciones en una sola plataforma hecha para servicios técnicos.
          </p>

          <div class="hero-actions">
            <a class="primary-btn landing-btn" routerLink="/dashboard">Ver dashboard</a>
            <a class="secondary-btn landing-btn" routerLink="/clientes">Probar flujo</a>
          </div>

          <div class="metrics-strip">
            <div>
              <strong>3x</strong>
              <span>Más velocidad</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Seguimiento</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>Visibilidad</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="mini-window">
            <div class="mini-header">
              <span class="dot blue"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="mini-body">
              <div class="mini-stat large">$84.500</div>
              <div class="mini-stat-row">
                <span>Clientes</span>
                <strong>128</strong>
              </div>
              <div class="mini-stat-row">
                <span>Ordenes</span>
                <strong>47</strong>
              </div>
              <div class="mini-stat-row success">
                <span>Entregadas</span>
                <strong>91%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="feature-grid">
        <article class="feature-card">
          <div class="icon">01</div>
          <h3>Clientes y historial</h3>
          <p>Guardá cada cliente con su teléfono, dirección y todas las intervenciones asociadas.</p>
        </article>

        <article class="feature-card">
          <div class="icon">02</div>
          <h3>Gestión de ordenes</h3>
          <p>Seguimiento por estado, presupuestos, notas técnicas y tiempos de reparación.</p>
        </article>

        <article class="feature-card">
          <div class="icon">03</div>
          <h3>Reportes claros</h3>
          <p>Mantené el control operativo con un panel de métricas y KPI listos para vender tu servicio.</p>
        </article>
      </div>

      <div class="pitch-panel">
        <div>
          <p class="eyebrow">¿Por qué funciona?</p>
          <h2>Diseñado para técnicos que quieren cobrar mejor y trabajar ordenados.</h2>
        </div>

        <ul class="benefits-list">
          <li>Control total del taller sin hojas ni Excel.</li>
          <li>Más confianza para presupuestar y cerrar reparaciones.</li>
          <li>Excelente base para venderlo como software a otros técnicos.</li>
        </ul>
      </div>
    </section>
  `,
  styleUrl: './app.scss'
})
export class LandingPageComponent {}
