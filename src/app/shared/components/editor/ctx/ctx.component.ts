import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IWidget } from 'src/app/model/widget.interface';
import { DefaultOverlayContainer } from 'src/app/services/default-overlay';
import { CONTAINER_DATA } from 'src/app/services/overlay.service';

export type TAction = 'add' | 'delete' | 'image' | 'gradient' | 'text-color' | 'text';

@Component({
  selector: 'app-ctx',
  templateUrl: './ctx.component.html',
  styleUrls: ['./ctx.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtxComponent extends DefaultOverlayContainer<any> implements OnDestroy {
  private beforeAction$ = new Subject<{ action: TAction; data: Record<string, any> }>();
  color: string | undefined = 'black';
  gradient: string | undefined = 'black';

  constructor(@Inject(CONTAINER_DATA) public config: { widget: IWidget; block: boolean; }) {
    super();
    if (this.config.widget) {
      if (this.config.widget.background) { this.gradient = this.config.widget.background; }
      if (this.config.widget.textColor) { this.color = this.config.widget.textColor; }
    }
  }

  get beforeAction(): Observable<{ action: TAction; data: Record<string, any> }> {
    return this.beforeAction$.asObservable();
  }

  trigger(action: TAction, data: Record<string, any> = {}): void {
    this.beforeAction$.next({ action, data });
  }

  ngOnDestroy(): void {
    this.beforeAction$.complete();
    super.ngOnDestroy();
  }
}
