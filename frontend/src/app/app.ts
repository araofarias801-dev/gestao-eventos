import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatProgressBarModule, CommonModule],
  template: `
    <mat-progress-bar *ngIf="loading()" mode="indeterminate" class="nav-progress"></mat-progress-bar>
    <div class="page-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .nav-progress { position: fixed; top: 0; left: 0; right: 0; z-index: 999; }
    .page-content { padding: 0; }
  `]
})
export class App {
  loading = signal(false);

  constructor(router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) this.loading.set(true);
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loading.set(false);
      }
    });
  }
}
