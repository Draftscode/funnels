import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IWidget } from 'src/app/model/widget.interface';
import { DefaultOverlayContainer } from 'src/app/services/default-overlay';
import { CONTAINER_DATA } from 'src/app/services/overlay.service';

export interface IAction {
  name: string;
  id: string;
  icon: string;
}

@Component({
  selector: 'app-ctx',
  templateUrl: './ctx.component.html',
  styleUrls: ['./ctx.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtxComponent extends DefaultOverlayContainer<any> implements OnDestroy {
  private beforeAction$ = new Subject<IAction>();
  actions: IAction[];

  constructor(@Inject(CONTAINER_DATA) public data: { actions: IAction[] }) {
    super();
    this.actions = data.actions;
  }

  get beforeAction(): Observable<IAction> {
    return this.beforeAction$.asObservable();
  }

  trigger(action: IAction): void {
    this.beforeAction$.next(action);
  }

  ngOnDestroy(): void {
    this.beforeAction$.complete();
    super.ngOnDestroy();
  }
}
