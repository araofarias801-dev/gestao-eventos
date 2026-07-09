import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { provideRouter, Routes } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { EventList } from './event-list';
import { EventService } from '../../../../core/services/event';
import { NotificationService } from '../../../../core/services/notification';
import { MatDialog } from '@angular/material/dialog';
import { Event, Page } from '../../../../core/models/event.model';

const mockEvent: Event = {
  id: 1, title: 'Evento Teste', description: 'Desc',
  eventDate: '2026-07-15T10:00:00', location: 'SP',
  createdAt: '2026-07-01T00:00:00', updatedAt: '2026-07-01T00:00:00',
};

const mockPage: Page<Event> = {
  content: [mockEvent], totalElements: 1, totalPages: 1, number: 0, size: 10,
};

describe('EventList', () => {
  let component: EventList;
  let fixture: ComponentFixture<EventList>;
  let eventService: Partial<EventService>;
  let notification: Partial<NotificationService>;
  let dialog: Partial<MatDialog>;

  beforeEach(async () => {
    eventService = { findAll: vi.fn().mockReturnValue(of(mockPage)), delete: vi.fn().mockReturnValue(of(undefined)) };
    notification = { success: vi.fn(), error: vi.fn() };
    dialog = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [EventList],
      providers: [
        provideRouter([{ path: 'events', children: [] }, { path: 'events/new', children: [] }] as Routes),
        provideNoopAnimations(),
        { provide: EventService, useValue: eventService },
        { provide: NotificationService, useValue: notification },
        { provide: MatDialog, useValue: dialog },
      ],
    })
    .overrideProvider(MatDialog, { useValue: dialog })
    .compileComponents();

    fixture = TestBed.createComponent(EventList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar eventos ao iniciar', () => {
    expect(eventService.findAll).toHaveBeenCalledWith(0, 10, expect.any(Object));
    expect(component.events().length).toBe(1);
    expect(component.totalElements()).toBe(1);
  });

  it('deve exibir notificação de erro ao falhar ao carregar', () => {
    (eventService.findAll as ReturnType<typeof vi.fn>).mockReturnValue(throwError(() => new Error('erro')));
    component.loadEvents();
    expect(notification.error).toHaveBeenCalledWith('Erro ao carregar eventos');
    expect(component.loading()).toBe(false);
  });

  it('deve atualizar página ao mudar o paginator', () => {
    component.onPageChange({ pageIndex: 1, pageSize: 5, length: 10 } as any);
    expect(component.currentPage).toBe(1);
    expect(component.pageSize).toBe(5);
    expect(eventService.findAll).toHaveBeenCalledTimes(2);
  });

  it('clearFilters deve resetar o formulário', () => {
    component.filterForm.patchValue({ title: 'teste' });
    component.clearFilters();
    expect(component.filterForm.get('title')?.value).toBeNull();
  });

  it('excluir deve abrir dialog de confirmação', () => {
    (dialog.open as ReturnType<typeof vi.fn>).mockReturnValue({ afterClosed: () => of(false) });
    component.excluir(1);
    expect(dialog.open).toHaveBeenCalled();
  });

  it('excluir deve deletar e recarregar ao confirmar', () => {
    (eventService.delete as ReturnType<typeof vi.fn>).mockReturnValue(of(undefined));
    (dialog.open as ReturnType<typeof vi.fn>).mockReturnValue({ afterClosed: () => of(true) });
    component.excluir(1);
    expect(eventService.delete).toHaveBeenCalledWith(1);
    expect(notification.success).toHaveBeenCalledWith('Evento excluído com sucesso!');
  });
});
