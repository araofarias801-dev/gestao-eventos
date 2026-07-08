import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
  events: Event[] = [];
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  loading = false;
  displayedColumns = ['title', 'eventDate', 'location', 'actions'];

  constructor(private eventService: EventService, private router: Router, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.eventService.findAll(this.currentPage, this.pageSize).subscribe({
      next: (page) => {
        this.events = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.snackBar.open('Erro ao carregar eventos', 'Fechar', { duration: 3000 });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
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
