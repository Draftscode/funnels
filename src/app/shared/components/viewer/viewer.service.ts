import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { IFunnel } from "src/app/model/funnel.interface";
import { TWidgetType } from "src/app/model/widget.interface";
import { BlockService } from "src/app/services/block.service";
import { FunnelService } from "src/app/services/funnel.service";
import { PageService } from "src/app/services/page.service";
import { WidgetService } from "src/app/services/widget.service";
import { IBlock } from "../editor/block.interface";
import { IPage } from "../page/page.interface";

export interface DataStorage {
  unchecked: boolean;
  created: Date;
  record: Record<string, any>;
}

const STORAGE_NAME = 'saved-funnels';

@Injectable({
  providedIn: 'root',
})
export class ViewerService {

  // funnel objects
  private funnel: BehaviorSubject<IFunnel | undefined> = new BehaviorSubject<IFunnel | undefined>(undefined);
  private pages: BehaviorSubject<Record<string, IPage>> = new BehaviorSubject<Record<string, IPage>>({});
  private blocks: BehaviorSubject<Record<string, IBlock>> = new BehaviorSubject<Record<string, IBlock>>({});
  private widgets: BehaviorSubject<Record<string, TWidgetType>> = new BehaviorSubject<Record<string, TWidgetType>>({});

  constructor(
    private pageApi: PageService,
    private blockApi: BlockService,
    private widgetApi: WidgetService,
    private funnelApi: FunnelService) {
  }
  // objects changed
  public blocksChanged(): Observable<Record<string, IBlock>> { return this.blocks.asObservable(); }
  public widgetsChanged(): Observable<Record<string, TWidgetType>> { return this.widgets.asObservable(); }
  public pagesChanged(): Observable<Record<string, IPage>> { return this.pages.asObservable(); }
  public funnelChanged(): Observable<IFunnel | undefined> { return this.funnel.asObservable(); }

  public getFunnelById(funnelId: string | undefined): Observable<any> {
    if (!funnelId) { return of(void 0); }
    return this.funnelApi.getItemById(funnelId).pipe(switchMap((funnel: IFunnel | undefined) => {
      this.funnel.next(funnel);
      if (!funnel?.pageIds) { return of(void 0); }
      return this.pageApi.getItemsById(funnel.pageIds).pipe(switchMap((pages: Record<string, IPage>) => {
        this.pages.next(pages);
        if (!pages) { return of(void 0); }

        let blockIds: string[] = [];
        Object.keys(pages).forEach((pageId: string) => blockIds = blockIds.concat(pages[pageId].blockIds));
        return this.blockApi.getItemsById(blockIds).pipe(switchMap((blocks: Record<string, IBlock>) => {
          this.blocks.next(blocks);
          if (!blocks) { return of(void 0); }
          let widgetIds: string[] = [];
          Object.keys(blocks).forEach((blockId: string) => widgetIds = widgetIds.concat(blocks[blockId].widgetIds));
          return this.widgetApi.getItemsById(widgetIds).pipe(tap((widgets: Record<string, TWidgetType>) => {
            this.widgets.next(widgets);
          }));
        }));
      }));
    }));
  }

  public loadResponseForFunnel(funnelId: string): Observable<DataStorage[]> {
    const data: Record<string, DataStorage[]> = this.load() || {};
    return of(data[funnelId]);
  }

  private load(): Record<string, DataStorage[]> | undefined {
    const s: string | null = localStorage.getItem(STORAGE_NAME);
    if (!s) { return undefined; }
    const r: Record<string, DataStorage[]> = JSON.parse(s);
    return r;
  }

  public save(funnelId: string, record: Record<string, any>): Observable<Record<string, IFunnel>> {
    const d: DataStorage = {
      unchecked: true,
      created: new Date(),
      record,
    }

    const data: Record<string, DataStorage[]> = this.load() || {};
    const responseList: DataStorage[] = data[funnelId] || [];
    responseList.push(d);
    data[funnelId] = responseList;

    const totalResponses: number = responseList.length;
    const uncheckedResponses: number = responseList.filter((r: Record<string, any>) => r.unchecked).length;

    localStorage.setItem(STORAGE_NAME, JSON.stringify(data));
    return this.funnelApi.updateProperty(funnelId, { totalResponses, uncheckedResponses });
  }
}
