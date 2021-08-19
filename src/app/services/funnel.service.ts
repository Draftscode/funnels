import { Injectable } from "@angular/core";
import { concat, forkJoin, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { IFunnel } from "../model/funnel.interface";
import { IPage } from "../shared/components/page/page.interface";
import { GlobalUtils } from "../utils/global.utils";
import { ModelService } from "./model.service";
import { PageService } from "./page.service";

@Injectable({
  providedIn: 'root',
})
export class FunnelService extends ModelService<IFunnel>{
  constructor(private pageApi: PageService) {
    super();
    this.STORAGE_NAME = 'funnels';
    this.load().subscribe((f: Record<string, IFunnel>) => { this.updateItems(f).subscribe(); });
  }

  /**
  * creates a new funnel with predefined settings
  * @param {string[]} pageIds list of page ids
  * @returns IFunnel
  */
  public createFunnel(): Observable<IFunnel> {
    const funnel: IFunnel = {
      id: GlobalUtils.uuidv4(),
      name: 'Neuer Funnel',
      totalResponses: 0,
      uncheckedResponses: 0,
      pageIds: [],
      published: false,
    };

    return this.pageApi.createPage().pipe(switchMap((page: IPage) => {
      funnel.pageIds = [page.id];
      return this.create(funnel.id, funnel);
    })).pipe(map(() => funnel));
  }

  /**
   * deletes a single funnel
   * @param {stirng} funnelId id of the funnel
   * @returns Observable<Record<string, any> | undefined>
   */
  public deleteFunnel(funnelId: string): Observable<Record<string, any> | undefined> {
    const funnel: IFunnel = this.items.getValue()[funnelId];
    if (!funnel) { return of(undefined); }

    console.log('TRY TO DELETE FUNNEL', funnelId, funnel.pageIds);
    if (funnel.pageIds.length > 0) {
      return forkJoin((funnel.pageIds).map((pageId: string) =>
        this.pageApi.deletePage(pageId))).pipe(switchMap(() => this.deleteItem(funnelId)));
    }
    return this.deleteItem(funnelId);
  }
}
