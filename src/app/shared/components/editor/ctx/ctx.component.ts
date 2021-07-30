import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DefaultOverlayContainer } from 'src/app/services/default-overlay';

@Component({
  selector: 'app-ctx',
  templateUrl: './ctx.component.html',
  styleUrls: ['./ctx.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtxComponent extends DefaultOverlayContainer<any> implements OnDestroy {
  private beforeAction$ = new Subject<string>();

  constructor() {
    super();
  }

  get beforeAction(): Observable<string> {
    return this.beforeAction$.asObservable();
  }

  trigger(action: string): void {
    this.beforeAction$.next(action);
  }

  ngOnDestroy(): void {
    this.beforeAction$.complete();
    super.ngOnDestroy();
  }
}
