import { Injectable } from "@angular/core";
import { BehaviorSubject, concat, forkJoin, Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { IFunnel } from "src/app/model/funnel.interface";
import { IWidget, TWidgetType } from "src/app/model/widget.interface";
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
  private pages: BehaviorSubject<Record<string, IPage>> = new BehaviorSubject<Record<string, IPage>>({});
  private blocks: BehaviorSubject<Record<string, IBlock>> = new BehaviorSubject<Record<string, IBlock>>({});
  private widgets: BehaviorSubject<Record<string, TWidgetType>> = new BehaviorSubject<Record<string, TWidgetType>>({});

  public blocksChanged(): Observable<Record<string, IBlock>> { return this.blocks.asObservable(); }
  public widgetsChanged(): Observable<Record<string, TWidgetType>> { return this.widgets.asObservable(); }

  private selectedPageId: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private selectedWidgetId: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  private selectedBlockId: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

  constructor(private pageApi: PageService,
    private blockApi: BlockService,
    private widgetApi: WidgetService,
    private confirmDialogService: ConfirmDialogService,
    private funnelApi: FunnelService) {
      // this.widgetApi.afterItemUpdated().subscribe((widget:IWidget)=>{^
      //   this.widgets.
      //   this.widgets.next(
      // })
  }

  selectedPageIdChanged(): Observable<string | undefined> { return this.selectedPageId.asObservable(); }
  selectedBlockIdChanged(): Observable<string | undefined> { return this.selectedBlockId.asObservable(); }
  selectedWidgetIdChanged(): Observable<string | undefined> { return this.selectedWidgetId.asObservable(); }

  createPage(funnelId: string): void {
    if (!funnelId) { return; }
    this.funnelApi.getItemById(funnelId).subscribe((funnel: IFunnel | undefined) => {
      const pageIds: string[] = funnel?.pageIds || [];
      this.pageApi.createPage({ index: pageIds.length }).pipe(switchMap((page: IPage) => {
        this.selectPage(page.id, page.blockIds);
        return this.funnelApi.updateProperty(funnelId, { pageIds: pageIds.concat(page.id) });
      })).subscribe();
    });
  }

  deletePage(funnelId: string, pageId: string): void {
    this.confirmDialogService.open({
      title: 'LABEL.confirm',
      text: {
        value: 'QUESTION.delete_value',
        params: { value: 'LABEL.page' }
      }
    }).subscribe((r: DialogResult) => {
      this.funnelApi.getItemById(funnelId).subscribe((funnel: IFunnel | undefined) => {
        if (!funnel || r?.type !== DialogResultType.CONFIRM) { return; }
        this.pageApi.getItemById(pageId).subscribe((page: IPage | undefined) => {
          const pageIds: string[] = (funnel.pageIds || []).filter((id: string) => id !== pageId);
          concat(
            this.funnelApi.updateProperty(funnel.id, { pageIds }),
            ...(page?.blockIds || []).map((blockId: string) => this.deleteBlock(blockId, pageId)),
            this.pageApi.deleteItem(pageId),
          ).subscribe(() => {
            this.selectPage(undefined);
          });
        });
      });
    });
  }

  removeBlock(blockId: string, pageId: string): void {
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

    return this.pageApi.getItemById(pageId).pipe(switchMap((page: IPage | undefined) => {
      if (!page) { return of(null); }
      const blockIds: string[] = page.blockIds?.filter((bId: string) => bId !== blockId) || [];

      return this.pageApi.updateProperty(page.id, { blockIds }).pipe(switchMap((r: Record<string, IPage>) => {
        return this.blockApi.getItemById(blockId).pipe(switchMap((block: IBlock | undefined) => {
          const widgetIds: string[] = block?.widgetIds || [];
          if (widgetIds.length <= 0) { return of(null); }
          return forkJoin(widgetIds.map((widgetId: string) => {
            return this.widgetApi.deleteItem(widgetId);
          }));
        }));
      })).pipe(switchMap(() => {
        return this.blockApi.deleteItem(blockId);
      }));
    }));
  }


  selectPage(pageId: string | undefined, blockIds: string[] | undefined = undefined): void {
    this.selectedPageId.next(pageId);
    this.selectWidget(undefined);
    if (pageId && blockIds && blockIds.length > 0) {
      this.blockApi.getItemsById(blockIds).subscribe((blocks: Record<string, IBlock>) => {
        this.blocks.next(blocks);


        const widgetIds: string[] = Object.keys(blocks)
          .map((blockId: string) => blocks[blockId].widgetIds || [])
          .reduce((accu, value) => accu.concat(value));

        this.widgetApi.getItemsById(widgetIds).subscribe((items: Record<string, TWidgetType>) => {
          this.widgets.next(items);
        });
      });
      this.selectBlock(blockIds[0]);
    }
  }

  public selectBlock(blockId: string | undefined): void {
    this.selectedBlockId.next(blockId);
  }

  public selectWidget(widgetId: string | undefined): void {
    this.selectedWidgetId.next(widgetId);
  }
}
