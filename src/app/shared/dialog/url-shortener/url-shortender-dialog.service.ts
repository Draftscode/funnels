import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IImage } from '../../components/images/image.interface';
import { DialogResult } from '../dialog-result.interface';
import { UrlShortenerComponent } from './url-shortener.component';

export interface ImageDialogData {
  image?: IImage;
}

@Injectable({ providedIn: 'root' })
export class UrlShortenerDialogService {
  constructor(protected matDialog: MatDialog) { }

  public open(): Observable<DialogResult> {
    // the magical part of importing a module asynchronously
    return from(import('./url-shortener.module')).pipe(switchMap(() => {
      return this.matDialog.open(UrlShortenerComponent, {}).afterClosed();
    }));
  }

}
