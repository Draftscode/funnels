import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { IFunnel } from "../model/funnel.interface";
import * as funnelActions from './../shared/components/funnel/funnel.actions';
import * as fromFunnel from './../shared/components/funnel/funnel.reducer';

@Injectable({
  providedIn: 'root',
})
export class Funnel2Service {
  constructor(private http: HttpClient, private store: Store<fromFunnel.FunnelState>) {

    const f: IFunnel[] = this.loadFunnels();
    f.forEach((f: IFunnel) => {
      this.store.dispatch(new funnelActions.Create(f));
    });
  }

  private loadFunnels(): IFunnel[] {
    const s: string | null = localStorage.getItem('funnels');
    if (!s) { return []; }

    const funnels: IFunnel[] = JSON.parse(s);
    return funnels;
  }

  public delete(funnelId: string): Observable<void> {
    const funnels: IFunnel[] = this.loadFunnels();
    console.log(funnels);
    localStorage.setItem('funnels', JSON.stringify(funnels.filter((f: IFunnel) => f.id !== funnelId)));
    return of(void 0);
  }

  public create(funnel: IFunnel): Observable<IFunnel> {
    const funnels: IFunnel[] = this.loadFunnels();
    return of(null).pipe(switchMap(() => {
      localStorage.setItem('funnels', JSON.stringify(funnels.concat(funnel)));
      return of(funnel);
    }));
  }

  public storeFunnels(funnels: IFunnel[]): Observable<IFunnel[]> {
    return of(null).pipe(switchMap(() => {
      localStorage.setItem('funnels', JSON.stringify(funnels));
      return of(funnels);
    }));
  }
}
