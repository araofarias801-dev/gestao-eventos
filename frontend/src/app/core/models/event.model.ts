export interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventRequest {
  title: string;
  description: string;
  eventDate: string;
  location: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
