import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../../../core/services/notification';
import { EventService } from '../../../../core/services/event';
import { Event } from '../../../../core/models/event.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss',
})
export class EventDetail implements OnInit {
  event = signal<Event | null>(null);
  loading = signal(false);

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loading.set(true);
    this.eventService.findById(id).subscribe({
      next: (event) => {
        this.event.set(event);
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Evento não encontrado');
        this.router.navigate(['/events']);
      }
    });
  }

  editar(): void {
    this.router.navigate(['/events', this.event()!.id, 'edit']);
  }

  voltar(): void {
    this.router.navigate(['/events']);
  }
}
