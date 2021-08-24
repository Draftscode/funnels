import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DialogResult } from '../dialog-result.interface';
import { ConfirmDialogComponent } from './confirm-dialog.component';

export interface ConfirmDialogData {
  title: string;
  text: { value: string, params: Record<string, any> };
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  constructor(protected matDialog: MatDialog) { }

  public open(data: ConfirmDialogData): Observable<DialogResult> {
    // the magical part of importing a module asynchronously
    return from(import('./confirm-dialog.module')).pipe(switchMap(() => {
      return this.matDialog.open(ConfirmDialogComponent, { data }).afterClosed();
    }));
  }

}
