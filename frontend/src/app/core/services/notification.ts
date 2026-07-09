import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private config = {
    duration: 3500,
    verticalPosition: 'top' as const,
    horizontalPosition: 'end' as const,
  };

  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.snackBar.open(message, '✕', {
      ...this.config,
      panelClass: ['snack-success'],
    });
  }

  error(message: string): void {
    this.snackBar.open(message, '✕', {
      ...this.config,
      panelClass: ['snack-error'],
    });
  }

  warning(message: string): void {
    this.snackBar.open(message, '✕', {
      ...this.config,
      panelClass: ['snack-warning'],
    });
  }
}
