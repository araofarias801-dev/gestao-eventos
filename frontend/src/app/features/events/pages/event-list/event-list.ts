import { Component, OnInit, OnDestroy, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification';
import { ConfirmDialog } from '../../../../shared/confirm-dialog/confirm-dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EventService } from '../../../../core/services/event';
import { Event } from '../../../../core/models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss',
})
export class EventList implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  events = signal<Event[]>([]);
  totalElements = signal(0);
  pageSize = 10;
  currentPage = 0;
  loading = signal(false);
  displayedColumns = ['title', 'description', 'eventDate', 'location', 'actions'];
  filterForm!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      title: [''],
      location: [''],
      dateFrom: [''],
      dateTo: [''],
    });
    this.loadEvents();
    this.filterForm.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 0;
      if (this.paginator) this.paginator.pageIndex = 0;
      this.loadEvents();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  loadEvents(): void {
    this.loading.set(true);
    const { title, location, dateFrom, dateTo } = this.filterForm?.value ?? {};
    const filters: Record<string, string> = {};
    if (title) filters['title'] = title;
    if (location) filters['location'] = location;
    if (dateFrom) {
      const d = new Date(dateFrom);
      const yyyy = d.getFullYear();
      const MM = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      filters['dateFrom'] = `${yyyy}-${MM}-${dd}T00:00:00`;
    }
    if (dateTo) {
      const d = new Date(dateTo);
      const yyyy = d.getFullYear();
      const MM = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      filters['dateTo'] = `${yyyy}-${MM}-${dd}T23:59:59`;
    }
    this.eventService.findAll(this.currentPage, this.pageSize, filters).subscribe({
      next: (page) => {
        this.events.set(page.content);
        this.totalElements.set(page.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.notification.error('Erro ao carregar eventos');
        this.loading.set(false);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadEvents();
  }

  novo(): void {
    this.router.navigate(['/events/new']);
  }

  editar(id: number): void {
    this.router.navigate(['/events', id, 'edit']);
  }

  detalhe(id: number): void {
    this.router.navigate(['/events', id]);
  }

  excluir(id: number): void {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '380px',
      data: { title: 'Excluir Evento', message: 'Deseja realmente excluir este evento? Esta ação não pode ser desfeita.' },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.eventService.delete(id).subscribe({
        next: () => {
          this.notification.success('Evento excluído com sucesso!');
          this.loadEvents();
        },
        error: () => {
          this.notification.error('Erro ao excluir evento');
        }
      });
    });
  }
}
