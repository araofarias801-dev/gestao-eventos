import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatIconModule],
  template: `
    <div class="page-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .page-content { padding: 0; }
  `]
})
export class App {}
