import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { provideRouter, Routes } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { EventForm } from './event-form';
import { EventService } from '../../../../core/services/event';
import { NotificationService } from '../../../../core/services/notification';
import { Event } from '../../../../core/models/event.model';

const mockEvent: Event = {
  id: 1, title: 'Evento Teste', description: 'Desc',
  eventDate: '2026-07-15T10:00:00', location: 'SP',
  createdAt: '2026-07-01T00:00:00', updatedAt: '2026-07-01T00:00:00',
};

describe('EventForm — modo criação', () => {
  let component: EventForm;
  let fixture: ComponentFixture<EventForm>;
  let eventService: Partial<EventService>;
  let notification: Partial<NotificationService>;

  beforeEach(async () => {
    eventService = { create: vi.fn().mockReturnValue(of(mockEvent)), update: vi.fn() };
    notification = { success: vi.fn(), error: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [EventForm],
      providers: [
        provideRouter([{ path: 'events', children: [] }] as Routes),
        provideNoopAnimations(),
        { provide: EventService, useValue: eventService },
        { provide: NotificationService, useValue: notification },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve iniciar no modo criação (isEdit = false)', () => {
    expect(component.isEdit).toBe(false);
  });

  it('formulário deve ser inválido sem campos preenchidos', () => {
    expect(component.form.valid).toBe(false);
  });

  it('formulário deve ser válido com todos os campos', () => {
    component.form.patchValue({
      title: 'Título', description: 'Desc',
      eventDate: new Date('2026-07-15'), eventTime: '10:00', location: 'SP',
    });
    expect(component.form.valid).toBe(true);
  });

  it('salvar com formulário inválido deve marcar campos como touched', () => {
    component.salvar();
    expect(component.form.get('title')?.touched).toBe(true);
    expect(eventService.create).not.toHaveBeenCalled();
  });

  it('salvar com formulário válido deve chamar create', () => {
    component.form.patchValue({
      title: 'Título', description: 'Desc',
      eventDate: new Date('2026-07-15'), eventTime: '10:00', location: 'SP',
    });
    component.salvar();
    expect(eventService.create).toHaveBeenCalled();
    expect(notification.success).toHaveBeenCalledWith('Evento criado!');
  });

  it('deve notificar erro ao falhar ao criar', () => {
    (eventService.create as ReturnType<typeof vi.fn>).mockReturnValue(throwError(() => new Error()));
    component.form.patchValue({
      title: 'Título', description: 'Desc',
      eventDate: new Date('2026-07-15'), eventTime: '10:00', location: 'SP',
    });
    component.salvar();
    expect(notification.error).toHaveBeenCalledWith('Erro ao salvar evento');
  });
});

describe('EventForm — modo edição', () => {
  let component: EventForm;
  let fixture: ComponentFixture<EventForm>;
  let eventService: Partial<EventService>;
  let notification: Partial<NotificationService>;

  beforeEach(async () => {
    eventService = {
      findById: vi.fn().mockReturnValue(of(mockEvent)),
      update: vi.fn().mockReturnValue(of(mockEvent)),
    };
    notification = { success: vi.fn(), error: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [EventForm],
      providers: [
        provideRouter([{ path: 'events', children: [] }] as Routes),
        provideNoopAnimations(),
        { provide: EventService, useValue: eventService },
        { provide: NotificationService, useValue: notification },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve iniciar no modo edição (isEdit = true)', () => {
    expect(component.isEdit).toBe(true);
  });

  it('deve carregar dados do evento no formulário', () => {
    expect(eventService.findById).toHaveBeenCalledWith('1');
    expect(component.form.get('title')?.value).toBe('Evento Teste');
    expect(component.form.get('location')?.value).toBe('SP');
  });

  it('salvar deve chamar update no modo edição', () => {
    component.form.patchValue({ eventTime: '10:00' });
    component.salvar();
    expect(eventService.update).toHaveBeenCalledWith('1', expect.any(Object));
    expect(notification.success).toHaveBeenCalledWith('Evento atualizado!');
  });
});
