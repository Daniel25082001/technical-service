import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly document = inject(DOCUMENT);
  protected readonly isDarkMode = signal(this.readDarkModePreference());
  protected readonly title = 'Servicio técnico';

  constructor() {
    this.applyTheme();
  }

  protected toggleTheme(): void {
    this.isDarkMode.update((isDarkMode) => !isDarkMode);
    this.applyTheme();
    window.localStorage.setItem(
      'technical-service-theme',
      this.isDarkMode() ? 'dark' : 'light',
    );
  }

  private applyTheme(): void {
    this.document.documentElement.setAttribute(
      'data-bs-theme',
      this.isDarkMode() ? 'dark' : 'light',
    );
  }

  private readDarkModePreference(): boolean {
    return typeof window !== 'undefined' &&
      window.localStorage.getItem('technical-service-theme') === 'dark';
  }
}
