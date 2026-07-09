import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event';
import { Event, Page } from '../models/event.model';
import { provideHttpClient } from '@angular/common/http';

const mockEvent: Event = {
  id: 1,
  title: 'Evento Teste',
  description: 'Descrição',
  eventDate: '2026-07-15T10:00:00',
  location: 'São Paulo',
  createdAt: '2026-07-01T00:00:00',
  updatedAt: '2026-07-01T00:00:00',
};

const mockPage: Page<Event> = {
  content: [mockEvent],
  totalElements: 1,
  totalPages: 1,
  number: 0,
  size: 10,
};

describe('EventService', () => {
  let service: EventService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService],
    });
    service = TestBed.inject(EventService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('findAll deve chamar GET com page e size', () => {
    service.findAll(0, 10).subscribe(page => {
      expect(page.content.length).toBe(1);
      expect(page.totalElements).toBe(1);
    });
    const req = http.expectOne(r => r.url.includes('/events') && r.params.get('page') === '0');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('size')).toBe('10');
    req.flush(mockPage);
  });

  it('findAll deve enviar filtros como query params', () => {
    service.findAll(0, 10, { title: 'Teste' }).subscribe();
    const req = http.expectOne(r => r.params.get('title') === 'Teste');
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('findById deve chamar GET /events/:id', () => {
    service.findById(1).subscribe(event => {
      expect(event.id).toBe(1);
      expect(event.title).toBe('Evento Teste');
    });
    const req = http.expectOne(r => r.url.endsWith('/events/1'));
    expect(req.request.method).toBe('GET');
    req.flush(mockEvent);
  });

  it('create deve chamar POST /events', () => {
    const payload = { title: 'Novo', description: 'Desc', eventDate: '2026-07-15T10:00:00', location: 'SP' };
    service.create(payload).subscribe(event => {
      expect(event.title).toBe('Evento Teste');
    });
    const req = http.expectOne(r => r.url.endsWith('/events') && r.method === 'POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockEvent);
  });

  it('update deve chamar PUT /events/:id', () => {
    const payload = { title: 'Editado', description: 'Desc', eventDate: '2026-07-15T10:00:00', location: 'RJ' };
    service.update(1, payload).subscribe(event => {
      expect(event.id).toBe(1);
    });
    const req = http.expectOne(r => r.url.endsWith('/events/1') && r.method === 'PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(mockEvent);
  });

  it('delete deve chamar DELETE /events/:id', () => {
    service.delete(1).subscribe();
    const req = http.expectOne(r => r.url.endsWith('/events/1') && r.method === 'DELETE');
    req.flush(null);
  });
});
