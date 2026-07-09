import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-wrapper">
      <mat-icon class="not-found-icon">search_off</mat-icon>
      <h1>404</h1>
      <p>Página não encontrada</p>
      <button mat-raised-button color="primary" (click)="router.navigate(['/events'])">
        <mat-icon>arrow_back</mat-icon>
        Voltar para a lista
      </button>
    </div>
  `,
  styles: [`
    .not-found-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: calc(100vh - 64px);
      gap: 16px;
      color: #757575;
    }
    .not-found-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #bdbdbd;
    }
    h1 { font-size: 72px; margin: 0; color: #212121; }
    p { font-size: 18px; margin: 0; }
  `]
})
export class NotFound {
  constructor(public router: Router) {}
}
