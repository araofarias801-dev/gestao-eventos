import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
  loading = false;
  saving = false;
  isEdit = false;
  eventId?: number;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      eventDate: ['', Validators.required],
      location: ['', [Validators.required, Validators.maxLength(200)]],
    });

    this.eventId = this.route.snapshot.params['id'];
    if (this.eventId) {
      this.isEdit = true;
      this.loading = true;
      this.eventService.findById(this.eventId).subscribe({
        next: (event) => {
          this.form.patchValue({
            ...event,
            eventDate: new Date(event.eventDate),
          });
          this.loading = false;
        },
        error: () => {
          this.snackBar.open('Erro ao carregar evento', 'Fechar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  salvar(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const value = { ...this.form.value, eventDate: new Date(this.form.value.eventDate).toISOString() };

    const request = this.isEdit
      ? this.eventService.update(this.eventId!, value)
      : this.eventService.create(value);

    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Evento atualizado!' : 'Evento criado!',
          'Fechar', { duration: 3000 }
        );
        this.router.navigate(['/events']);
      },
      error: () => {
        this.snackBar.open('Erro ao salvar evento', 'Fechar', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/events']);
  }
}
