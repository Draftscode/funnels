import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
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
  constructor(private pageApi: PageService, private translate: TranslateService) {
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
      isTemplate: false,
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

    if (funnel.pageIds.length > 0) {
      return forkJoin((funnel.pageIds).map((pageId: string) =>
        this.pageApi.deletePage(pageId))).pipe(switchMap(() => this.deleteItem(funnelId)));
    }
    return this.deleteItem(funnelId);
  }

  public copy(funnelId: string): Observable<IFunnel> {
    const f: IFunnel = this.items.getValue()[funnelId];
    const applyValues = (f: IFunnel, pages: IPage[]): IFunnel => {
      const copy: IFunnel = Object.assign({}, f);
      copy.id = GlobalUtils.uuidv4();
      copy.isTemplate = false;
      copy.name = `${copy.name}-${GlobalUtils.uuidv4()}`;
      copy.pageIds = pages.map((p: IPage) => p.id);
      return copy;
    }

    if (f.pageIds.length > 0) {

      return forkJoin(f.pageIds.map((pageId: string) => this.pageApi.copy(pageId)))
        .pipe(switchMap((pages: IPage[]) => {
          const copy: IFunnel = applyValues(f, pages);
          return this.create(copy.id, copy);
        }));
    }

    const copy: IFunnel = applyValues(f, []);
    return this.create(copy.id, copy);
  }
}
