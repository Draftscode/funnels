import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { DialogResult } from '../dialog-result.interface';
import { ResponseDialogComponent } from './response.component';

@Injectable({ providedIn: 'root' })
export class ResponseDialogService {
  constructor(protected matDialog: MatDialog) { }

  public open(data: IFunnel): Observable<DialogResult> {
    // the magical part of importing a module asynchronously
    return from(import('./response.module')).pipe(switchMap(() => {
      return this.matDialog.open(ResponseDialogComponent, {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '90%',
        width: '90%',
        data,
      }).afterClosed();
    }));
  }

}
