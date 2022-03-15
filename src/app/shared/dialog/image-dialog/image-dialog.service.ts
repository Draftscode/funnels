import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IImage } from '../../components/images/image.interface';
import { DialogResult } from '../dialog-result.interface';
import { ImageDialog } from './image.dialog';

export interface ImageDialogData {
  image?: IImage;
}

@Injectable({ providedIn: 'root' })
export class ImageDialogService {
  constructor(protected matDialog: MatDialog) { }

  public open(data: ImageDialogData): Observable<DialogResult> {
    // the magical part of importing a module asynchronously
    return from(import('./image-dialog.module')).pipe(switchMap(() => {
      return this.matDialog.open(ImageDialog, {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '90%',
        width: '90%',
        data,
      }).afterClosed();
    }));
  }

}
