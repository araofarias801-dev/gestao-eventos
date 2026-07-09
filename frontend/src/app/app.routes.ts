import { Routes } from '@angular/router';
import { EventList } from './features/events/pages/event-list/event-list';
import { EventForm } from './features/events/pages/event-form/event-form';
import { EventDetail } from './features/events/pages/event-detail/event-detail';
import { NotFound } from './shared/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: 'events', component: EventList },
  { path: 'events/new', component: EventForm },
  { path: 'events/:id/edit', component: EventForm },
  { path: 'events/:id', component: EventDetail },
  { path: '**', component: NotFound },
];
