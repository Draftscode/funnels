import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TWidgetType } from 'src/app/model/widget.interface';
import { IBlock } from '../../components/editor/block.interface';
import { CreateDialogComponent } from './create-dialog.component';

@Injectable({ providedIn: 'root' })
export class CreateWidgetDialogService {
  constructor(protected matDialog: MatDialog) { }

  public open(data: { block: IBlock }): Observable<{ widget: TWidgetType }> {
    // the magical part of importing a module asynchronously
    return from(import('./create-dialog.module')).pipe(switchMap(() => {
      return this.matDialog.open(CreateDialogComponent, { data }).afterClosed();
    }));
  }

}
