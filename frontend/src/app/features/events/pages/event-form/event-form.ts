import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../../../core/services/notification';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { EventService } from '../../../../core/services/event';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './event-form.html',
  styleUrl: './event-form.scss',
})
export class EventForm implements OnInit {
  form!: FormGroup;
  loading = signal(false);
  saving = signal(false);
  isEdit = false;
  eventId?: number;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      eventDate: ['', Validators.required],
      eventTime: ['', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)]],
      location: ['', [Validators.required, Validators.maxLength(200)]],
    });

    this.eventId = this.route.snapshot.params['id'];
    if (this.eventId) {
      this.isEdit = true;
      this.loading.set(true);
      this.eventService.findById(this.eventId).subscribe({
        next: (event) => {
          const date = new Date(event.eventDate);
          const hh = String(date.getHours()).padStart(2, '0');
          const mm = String(date.getMinutes()).padStart(2, '0');
          this.form.patchValue({
            ...event,
            eventDate: date,
            eventTime: `${hh}:${mm}`,
          });
          this.loading.set(false);
        },
        error: () => {
          this.notification.error('Erro ao carregar evento');
          this.loading.set(false);
        }
      });
    }
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const { eventTime, eventDate, ...rest } = this.form.value;
    const date = new Date(eventDate);
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const isoString = `${yyyy}-${MM}-${dd}T${eventTime}:00`;
    const value = { ...rest, eventDate: isoString };

    const request = this.isEdit
      ? this.eventService.update(this.eventId!, value)
      : this.eventService.create(value);

    request.subscribe({
      next: () => {
        this.notification.success(this.isEdit ? 'Evento atualizado!' : 'Evento criado!');
        this.router.navigate(['/events']);
      },
      error: () => {
        this.notification.error('Erro ao salvar evento');
        this.saving.set(false);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/events']);
  }
}
