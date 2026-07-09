import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { provideRouter, Routes } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { EventDetail } from './event-detail';
import { EventService } from '../../../../core/services/event';
import { NotificationService } from '../../../../core/services/notification';
import { Event } from '../../../../core/models/event.model';

const mockEvent: Event = {
  id: 1, title: 'Evento Teste', description: 'Desc',
  eventDate: '2026-07-15T10:00:00', location: 'SP',
  createdAt: '2026-07-01T00:00:00', updatedAt: '2026-07-01T00:00:00',
};

describe('EventDetail', () => {
  let component: EventDetail;
  let fixture: ComponentFixture<EventDetail>;
  let eventService: Partial<EventService>;
  let notification: Partial<NotificationService>;

  beforeEach(async () => {
    eventService = { findById: vi.fn().mockReturnValue(of(mockEvent)) };
    notification = { success: vi.fn(), error: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [EventDetail],
      providers: [
        provideRouter([{ path: 'events', children: [] }] as Routes),
        provideNoopAnimations(),
        { provide: EventService, useValue: eventService },
        { provide: NotificationService, useValue: notification },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar evento pelo id ao iniciar', () => {
    expect(eventService.findById).toHaveBeenCalledWith('1');
    expect(component.event()?.title).toBe('Evento Teste');
    expect(component.loading()).toBe(false);
  });

  it('deve redirecionar e notificar ao falhar ao carregar', () => {
    (eventService.findById as ReturnType<typeof vi.fn>).mockReturnValue(throwError(() => new Error()));
    component.ngOnInit();
    expect(notification.error).toHaveBeenCalledWith('Evento não encontrado');
  });
});
