import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DialogResult } from '../dialog-result.interface';
import { CreateFunnelDialogComponent } from './create-funnel-dialog.component';

@Injectable({ providedIn: 'root' })
export class CreateFunnelDialogService {
  constructor(protected matDialog: MatDialog) { }

  public open(): Observable<DialogResult> {
    // the magical part of importing a module asynchronously
    return from(import('./create-funnel-dialog.module')).pipe(switchMap(() => {
      return this.matDialog.open(CreateFunnelDialogComponent, { panelClass: 'lightbox' }).afterClosed();
    }));
  }

}
