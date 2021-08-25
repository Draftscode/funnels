import { Injectable } from "@angular/core";
import { BehaviorSubject, concat, forkJoin, Observable, of } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { IFunnel } from "src/app/model/funnel.interface";
import { TWidgetType } from "src/app/model/widget.interface";
import { BlockService } from "src/app/services/block.service";
import { FunnelService } from "src/app/services/funnel.service";
import { PageService } from "src/app/services/page.service";
import { WidgetService } from "src/app/services/widget.service";
import { ConfirmDialogService } from "../../dialog/confirm-dialog/confirm-dialog.service";
import { DialogResult, DialogResultType } from "../../dialog/dialog-result.interface";
import { IPage } from "../page/page.interface";
import { IBlock } from "./block.interface";

@Injectable({ providedIn: 'root' })
export class EditorService {
  // funnel objects
  private funnel: BehaviorSubject<IFunnel | undefined> = new BehaviorSubject<IFunnel | undefined>(undefined);
  private pages: BehaviorSubject<Record<string, IPage>> = new BehaviorSubject<Record<string, IPage>>({});
  private blocks: BehaviorSubject<Record<string, IBlock>> = new BehaviorSubject<Record<string, IBlock>>({});
  private widgets: BehaviorSubject<Record<string, TWidgetType>> = new BehaviorSubject<Record<string, TWidgetType>>({});

  // selected objects
  private selectedPageId: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private selectedWidgetId: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private selectedBlockId: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private selectedFunnelId: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

  constructor(private pageApi: PageService,
    private blockApi: BlockService,
    private widgetApi: WidgetService,
    private confirmDialogService: ConfirmDialogService,
    private funnelApi: FunnelService) {
    this.funnelApi.afterItemUpdated().subscribe((f: IFunnel) => { this.funnel.next(f); });

    this.pageApi.afterItemUpdated().subscribe((p: IPage) => {
      const pages: Record<string, IPage> = JSON.parse(JSON.stringify(this.pages.getValue()));
      pages[p.id] = p;
      this.pages.next(pages);
    });

    this.blockApi.afterItemUpdated().subscribe((b: IBlock) => {
      const blocks: Record<string, IBlock> = JSON.parse(JSON.stringify(this.blocks.getValue()));
      blocks[b.id] = b;
      this.blocks.next(blocks);
    });

    this.widgetApi.afterItemUpdated().subscribe((w: TWidgetType) => {
      const widgets: Record<string, TWidgetType> = JSON.parse(JSON.stringify(this.widgets.getValue()));
      widgets[w.id] = w;
      this.widgets.next(widgets);
    });
  }

  // objects changed
  public blocksChanged(): Observable<Record<string, IBlock>> { return this.blocks.asObservable(); }
  public widgetsChanged(): Observable<Record<string, TWidgetType>> { return this.widgets.asObservable(); }
  public pagesChanged(): Observable<Record<string, IPage>> { return this.pages.asObservable(); }
  public funnelChanged(): Observable<IFunnel | undefined> { return this.funnel.asObservable(); }

  // selected objects changed
  public selectedPageIdChanged(): Observable<string | undefined> { return this.selectedPageId.asObservable(); }
  public selectedBlockIdChanged(): Observable<string | undefined> { return this.selectedBlockId.asObservable(); }
  public selectedWidgetIdChanged(): Observable<string | undefined> { return this.selectedWidgetId.asObservable(); }
  public selectedFunnelIdChanged(): Observable<string | undefined> { return this.selectedFunnelId.asObservable(); }

  /**
   * selects current active funnel
   * @param {IFunnel | undefined} funnel funnel to select
   * @returns void
   */
  public selectFunnel(funnelId: string | undefined): void {
    this.selectedFunnelId.next(funnelId);
    this.getData(funnelId).subscribe();
  }

  public getData(funnelId: string | undefined): Observable<any> {
    if (!funnelId) { return of(void 0); }
    return this.funnelApi.getItemById(funnelId).pipe(switchMap((funnel: IFunnel | undefined) => {
      this.funnel.next(funnel);
      if (!funnel?.pageIds) { return of(void 0); }
      return this.pageApi.getItemsById(funnel.pageIds).pipe(switchMap((pages: Record<string, IPage>) => {
        this.pages.next(pages);
        console.log(pages);
        if (!pages) { return of(void 0); }

        // select page
        const keys: string[] = Object.keys(pages);
        if (!this.selectedPageId.getValue() && keys.length > 0) {
          const pageId: string = keys.sort((a: string, b: string) => pages[a].index < pages[b].index ? -1 : 1)[0];
          this.selectPage(pageId);
        }

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

  public createPage(): void {
    const funnel: IFunnel | undefined = this.funnel.getValue();
    if (!funnel) { return; }
    const pageIds: string[] = funnel.pageIds || [];
    this.pageApi.createPage({ index: pageIds.length }).pipe(switchMap((page: IPage) => {
      this.selectPage(page.id);
      return this.funnelApi.updateProperty(funnel.id, { pageIds: pageIds.concat(page.id) });
    })).subscribe();
  }

  public deletePage(funnelId: string, pageId: string): void {
    this.confirmDialogService.open({
      title: 'LABEL.confirm',
      text: {
        value: 'QUESTION.delete_value',
        params: { value: 'LABEL.page' }
      }
    }).subscribe((r: DialogResult) => {
      const funnel: IFunnel | undefined = this.funnel.getValue();
      if (!funnel || r?.type !== DialogResultType.CONFIRM) { return; }
      const page: IPage | undefined = this.pages.getValue()[pageId];
      const pageIds: string[] = (funnel.pageIds || []).filter((id: string) => id !== pageId);
      concat(
        this.funnelApi.updateProperty(funnel.id, { pageIds }),
        ...(page?.blockIds || []).map((blockId: string) => this.deleteBlock(blockId, pageId)),
        this.pageApi.deleteItem(pageId),
      ).subscribe(() => {
        this.selectPage(undefined);
      });
    });
  }

  public removeBlock(blockId: string, pageId: string): void {
    this.confirmDialogService.open({
      title: 'LABEL.confirm',
      text: {
        value: 'QUESTION.delete_value',
        params: { value: 'LABEL.block' }
      }
    }).subscribe((r: DialogResult) => {
      if (r?.type !== DialogResultType.CONFIRM) { return; }
      this.deleteBlock(blockId, pageId).subscribe();
    });
  }

  public deleteBlock(blockId: string, pageId: string): Observable<any> {
    if (!blockId) { return of(null); }
    this.selectBlock(undefined);

    const page: IPage | undefined = this.pages.getValue()[pageId];
    if (!page) { return of(null); }
    const blockIds: string[] = page.blockIds?.filter((bId: string) => bId !== blockId) || [];

    return this.pageApi.updateProperty(page.id, { blockIds }).pipe(switchMap((r: Record<string, IPage>) => {
      const block: IBlock | undefined = this.blocks.getValue()[blockId];
      const widgetIds: string[] = block?.widgetIds || [];
      if (widgetIds.length <= 0) { return of(null); }
      return forkJoin(widgetIds.map((widgetId: string) => {
        return this.widgetApi.deleteItem(widgetId);
      }));
    })).pipe(switchMap(() => {
      return this.blockApi.deleteItem(blockId);
    }));
  }


  public selectPage(pageId: string | undefined): void {
    this.selectedPageId.next(pageId);
  }

  public selectBlock(blockId: string | undefined): void {
    this.selectedBlockId.next(blockId);
  }

  public selectWidget(widgetId: string | undefined): void {
    this.selectedWidgetId.next(widgetId);
  }
}
