import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
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
  ],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss',
})
export class EventList implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  events = signal<Event[]>([]);
  totalElements = signal(0);
  pageSize = 10;
  currentPage = 0;
  loading = signal(false);
  displayedColumns = ['title', 'description', 'eventDate', 'location', 'actions'];

  constructor(private eventService: EventService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading.set(true);
    this.eventService.findAll(this.currentPage, this.pageSize).subscribe({
      next: (page) => {
        this.events.set(page.content);
        this.totalElements.set(page.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Erro ao carregar eventos', 'Fechar', { duration: 3000 });
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
    if (confirm('Deseja realmente excluir este evento?')) {
      this.eventService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Evento excluído com sucesso', 'Fechar', { duration: 3000 });
          this.loadEvents();
        },
        error: () => {
          this.snackBar.open('Erro ao excluir evento', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
}
