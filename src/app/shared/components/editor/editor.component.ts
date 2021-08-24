import { CdkDrag } from '@angular/cdk/drag-drop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { concat, Observable, of } from 'rxjs';
import { map, shareReplay, switchMap, takeWhile } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { IWidget, TWidgetType } from 'src/app/model/widget.interface';
import { BlockService } from 'src/app/services/block.service';
import { FunnelService } from 'src/app/services/funnel.service';
import { PageService } from 'src/app/services/page.service';
import { WidgetService } from 'src/app/services/widget.service';
import { ConfirmDialogService } from '../../dialog/confirm-dialog/confirm-dialog.service';
import { DialogResult, DialogResultType } from '../../dialog/dialog-result.interface';
import { UrlShortenerDialogService } from '../../dialog/url-shortener/url-shortender-dialog.service';
import { IPage } from '../page/page.interface';
import { IBlock } from './block.interface';
import { CreateDialogComponent } from './create-dialog/create-dialog.component';
import { EditorService } from './editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
  displayedBlocks: IBlock[] = [];
  alive: boolean = true;
  zoom: number = 100;

  curDragHeight: number = 0;

  @ViewChildren('listItem') viewChildren!: QueryList<ElementRef>;
  @ViewChildren('container', { read: ElementRef }) blockChildren!: QueryList<ElementRef>;
  @ViewChildren('widgetRef', { read: ElementRef }) widgetChildren!: QueryList<ElementRef>;
  nameEditable: boolean = false;

  pos: { x: number; y: number } | undefined;

  pages: Record<string, IPage> = {};
  blocks: Record<string, IBlock> = {};
  widgets: Record<string, TWidgetType> = {};
  funnel: IFunnel | undefined;

  selectedBlockId: string | undefined;
  selectedWidgetId: string | undefined;
  selectedPageId: string | undefined;

  layoutLarge$ = this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge]).pipe(map(result => result.matches), shareReplay());
  layoutSmall$ = this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall]).pipe(map(result => result.matches), shareReplay());

  previewId: string | undefined = undefined;
  previewPosition: 'start' | 'end' | undefined = undefined;
  constructor(
    private funnelApi: FunnelService,
    private pageApi: PageService,
    private blockApi: BlockService,
    private widgetApi: WidgetService,
    private router: Router,
    private currentRoute: ActivatedRoute,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private confirmDialogService: ConfirmDialogService,
    private urlShortenerDialogService: UrlShortenerDialogService,
    public editorApi: EditorService,
  ) {
    this.editorApi.selectedPageIdChanged().pipe(takeWhile(() => this.alive)).subscribe((id: string | undefined) => this.selectedPageId = id);
    this.editorApi.selectedBlockIdChanged().pipe(takeWhile(() => this.alive)).subscribe((id: string | undefined) => this.selectedBlockId = id);
    this.editorApi.selectedWidgetIdChanged().pipe(takeWhile(() => this.alive)).subscribe((id: string | undefined) => this.selectedWidgetId = id);

    this.editorApi.blocksChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IBlock>) => this.blocks = items);

    this.editorApi.widgetsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, TWidgetType>) => this.widgets = items);
  }

  /**
   * loads related details like the pages connected to the funnel
   * @returns void
   */
  private init(): void {
    if (!this.pages || !this.funnel) { return; }
    const keys: string[] = Object.keys(this.pages || {}).filter((k: string) => this.funnel?.pageIds.includes(k));

    if (!this.selectedPageId && keys.length > 0) {
      const pageId: string = keys.sort((a: string, b: string) => this.pages[a].index < this.pages[b].index ? -1 : 1)[0];
      this.editorApi.selectPage(pageId, this.pages[pageId].blockIds);
    }
  }

  renamePage(pageId: string, name: string): void { this.pageApi.updateProperty(pageId, { name }).subscribe(); }


  /** Predicate function that only allows even numbers to be dropped into a list. */
  enterPredicate(index: number, item: CdkDrag<IBlock>): boolean {
    return false;
  }

  startResize(e: { distance: { x: number; y: number; } }, blockId: string): void {
    this.curDragHeight = (e?.distance?.y || 0);
  }

  endResize(e: { distance: { x: number; y: number; } }, blockId: string): void {
    const height: number = this.curDragHeight + this.blocks[blockId].height;
    this.curDragHeight = 0;
    this.blockApi.updateProperty(blockId, { height }).subscribe();
  }

  ngOnInit(): void {
    this.currentRoute.params.pipe(takeWhile(() => this.alive)).subscribe(params => {
      this.funnelApi.getItemById(params.funnelId).subscribe((funnel: IFunnel | undefined) => {
        this.funnel = funnel;
        if (this.funnel?.pageIds) {
          this.pageApi.getItemsById(this.funnel.pageIds).subscribe((pages: Record<string, IPage>) => {
            this.pages = pages;
            this.init();
          });
        }
        this.init();
      });
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  @ViewChild('pageContainer', { read: ElementRef }) pageContainer: ElementRef | undefined;

  activateWidget(ev: MouseEvent | undefined, el: ElementRef, blockId: string, widgetId: string | undefined = undefined): void {
    if (!this.selectedPageId) { return; }
    if (ev) { ev.stopPropagation(); }
    this.editorApi.selectBlock(blockId);
    this.editorApi.selectWidget(widgetId);
  }

  createWidget(): void {
    if (!this.selectedBlockId) { return; }
    this._createWidget(this.blocks[this.selectedBlockId]).subscribe((w: IWidget | null) => {
      if (!w) { return; }
      this.editorApi.selectWidget(w.id);
    });
  }

  private _createWidget(block: IBlock): Observable<IWidget | null> {
    return this.dialog.open(CreateDialogComponent, {
      data: { block, }, panelClass: 'lightbox'
    }).afterClosed().pipe(switchMap((r) => {
      if (!r) { return of(null); }
      const widgetIds: string[] = (block.widgetIds || []).concat(r.widget.id);


      return this.blockApi.updateProperty(block.id, { widgetIds }).pipe(switchMap(() => {
        return this.widgetApi.create(r.widget.id, r.widget);
      }));

    }));
  }

  deleteWidget(): void {
    this.confirmDialogService.open({
      title: 'LABEL.confirm',
      text: {
        value: 'QUESTION.delete_value',
        params: { value: 'LABEL.widget' }
      }
    }).subscribe((r: DialogResult) => {
      if (r?.type !== DialogResultType.CONFIRM) { return; }
      const id: string | undefined = this.selectedWidgetId;
      if (!id || !this.selectedBlockId) { return; }
      this.editorApi.selectWidget(undefined);
      const widgetIds: string[] = this.blocks[this.selectedBlockId].widgetIds?.filter((widgetId: string) => widgetId !== id) || [];
      this.blockApi.updateProperty(this.selectedBlockId, { widgetIds }).subscribe(() => {
        this.widgetApi.deleteItem(id).subscribe();
      });
    });
  }

  deletePage(pageId: string): void {
    this.confirmDialogService.open({
      title: 'LABEL.confirm',
      text: {
        value: 'QUESTION.delete_value',
        params: { value: 'LABEL.page' }
      }
    }).subscribe((r: DialogResult) => {
      if (!this.funnel || r?.type !== DialogResultType.CONFIRM) { return; }
      const pageIds: string[] = (this.funnel.pageIds || []).filter((id: string) => id !== pageId);
      const page: IPage = this.pages[pageId];
      concat(
        this.funnelApi.updateProperty(this.funnel.id, { pageIds }),
        ...(page.blockIds || []).map((blockId: string) => this.editorApi.deleteBlock(blockId, pageId)),
        this.pageApi.deleteItem(pageId),
      ).subscribe(() => {
        this.editorApi.selectPage(undefined);
      });
    });
  }

  get highlightedPageId(): string | undefined {
    if (!this.selectedWidgetId) { return undefined; }
    const w: TWidgetType = this.widgets[this.selectedWidgetId];
    return w && w.kind === 'button' && w.linkedTo ? w.linkedTo : undefined;
  }

  zoomIn(): void { this.zoom += 10; }

  zoomOut(): void { this.zoom -= 10; }

  isPointerOverContainer(container: HTMLElement): boolean {
    if (!this.pos) { return false; }

    const rect: DOMRect = container.getBoundingClientRect();
    if (this.pos.x >= rect.x && this.pos.x <= rect.x + rect.width
      && this.pos.y >= rect.y && this.pos.y <= rect.y + rect.height) {
      return true;
    }

    return false;
  }

  private checkIntersection(list: QueryList<ElementRef>, clazz?: string, options?: { listOfIds?: string[]; skip?: boolean, excludes?: string[] }): ElementRef | undefined {
    const elements: ElementRef[] = list.toArray().filter((e: ElementRef) => !options?.excludes?.includes(e.nativeElement.id));

    let match: ElementRef | undefined = undefined;
    elements.forEach((item: ElementRef) => {
      if (clazz) { item.nativeElement.classList.remove(clazz); }
      if (options?.skip ||
        ((!options?.listOfIds || options.listOfIds.length === 0 || options.listOfIds.includes(item.nativeElement.id)) &&
          this.isPointerOverContainer(item.nativeElement))) {
        if (clazz) { item.nativeElement.classList.add(clazz); }
        match = item;
      }
    });

    return match;
  }

  selectPage(page: IPage): void {
    if (!page) { return; }
    this.editorApi.selectPage(page.id, page.blockIds);
  }

  dragMove(event: { pointerPosition: { x: number; y: number } }, blockId: string): void {
    this.pos = event?.pointerPosition || undefined;
    this.checkIntersection(this.viewChildren, 'activated');
    this.checkIntersection(this.widgetChildren, 'has-drag-over', { listOfIds: this.blocks[blockId].widgetIds, skip: false });
    this.checkIntersection(this.blockChildren, 'has-drag-over', { skip: false });
  }

  blockMoved(event: { pointerPosition: { x: number; y: number } }, blockId: string): void {
    this.pos = event.pointerPosition;
    const { pos, el } = this.getBlockPosition([blockId]);
    this.previewPosition = pos;
    this.previewId = el ? el.nativeElement.id : undefined;
  }

  blockDropped(event: any, blockId: string, pageId: string): void {
    const pos = this.previewPosition;
    if (this.previewId) {
      const index: number = this.blockChildren.toArray().findIndex((e: ElementRef) => e.nativeElement.id === this.previewId);
      const curIndex: number = this.blockChildren.toArray().findIndex((e: ElementRef) => e.nativeElement.id === blockId);
      const finalIndex: number = index + (curIndex > index ? (pos === 'end' ? 1 : 0) : (pos === 'start' ? -1 : 0));
      const blockIds: string[] = this.pages[pageId].blockIds || [];
      blockIds.splice(curIndex, 1);
      blockIds.splice(finalIndex, 0, blockId);
      // blockIds[curIndex] = blockIds[finalIndex];
      // blockIds[finalIndex] = blockId;
      this.pageApi.updateProperty(pageId, { blockIds }).subscribe();
    }

    this.previewId = undefined;
  }

  startBlockDrag(event: any, blockId: string): void {
  }

  private getBlockPosition(excludes: string[] = []): { pos: 'start' | 'end' | undefined; el: ElementRef | undefined } {
    const el: ElementRef | undefined = this.checkIntersection(this.blockChildren, undefined, { excludes });
    if (el && this.pos) {
      const domRect: DOMRect = el.nativeElement.getBoundingClientRect();
      const middle: number = domRect.y + domRect.height / 2;
      return {
        pos: middle < this.pos?.y ? 'end' : 'start',
        el,
      };
    }


    return { el: undefined, pos: undefined };
  }



  dragExited(event: { dropPoint: { x: number; y: number } }, widgetId: string, curBlockId: string): void {
    const pageId: number = this.viewChildren.toArray().find((item: ElementRef) => this.isPointerOverContainer(item.nativeElement))?.nativeElement?.id;
    const targetedBlockId: string = this.blockChildren.toArray().find((item: ElementRef) => this.isPointerOverContainer(item.nativeElement))?.nativeElement?.id;
    const targetedWidgetId: string = this.widgetChildren.toArray().find((item: ElementRef) => this.isPointerOverContainer(item.nativeElement))?.nativeElement?.id;

    this.dragMove({ pointerPosition: { x: 0, y: 0 } }, curBlockId);
    if (pageId) { this.widgetApi.updateProperty(widgetId, { linkedTo: this.pages[pageId].id }).subscribe(); }
    // swap widget inside the same block
    else if (this.blocks[curBlockId].widgetIds?.includes(targetedWidgetId) && targetedWidgetId) {
      this.swapWidgets(this.widgets[widgetId], this.widgets[targetedWidgetId], this.blocks[curBlockId]);
    }
    // move from on to another block
    else if (targetedBlockId && curBlockId) {
      this.moveWidgetToBlock(widgetId, this.blocks[curBlockId], this.blocks[targetedBlockId]);
    }
  }

  /**
   * moves a widget from one block to another
   * @param {string} widgetId id of the widget
   * @param {IBlock} curBlock current block of the widget
   * @param {IBlock} targetBlock targeted block for the widget
   * @returns void
   */
  private moveWidgetToBlock(widgetId: string, curBlock: IBlock, targetBlock: IBlock): void {
    concat([
      this.blockApi.updateProperty(curBlock.id, { widgetIds: curBlock.widgetIds?.filter((id: string) => id !== widgetId) }),
      this.blockApi.updateProperty(targetBlock.id, { widgetIds: (targetBlock.widgetIds || []).concat(widgetId) }),
    ]).subscribe();
  }

  private swapWidgets(curWidget: IWidget, targetWidget: IWidget, block: IBlock): void {
    const widgetIds: string[] = block.widgetIds?.slice()!;
    const curIdx: number = widgetIds.findIndex((id: string) => id === curWidget.id);
    const targetIdx: number = widgetIds.findIndex((id: string) => id === targetWidget.id);

    widgetIds[curIdx] = targetWidget.id;
    widgetIds[targetIdx] = curWidget.id;

    this.blockApi.updateProperty(block.id, { widgetIds }).subscribe();
  }



  createBlock(): void {
    const pageId: string | undefined = this.selectedPageId;
    if (!pageId) { return; }
    this.blockApi.createBlock().pipe(switchMap((block: IBlock) => {
      const blockIds: string[] = (this.pages[pageId].blockIds || []).concat(block.id);
      return this.pageApi.updateProperty(pageId, { blockIds });
    })).subscribe();
  }

  demo(): void {
    this.confirmDialogService.open({
      title: 'LABEL.confirm',
      text: {
        value: 'QUESTION.publish_value',
        params: { value: 'LABEL.funnel' }
      }
    }).subscribe((r: DialogResult) => {
      if (r?.type !== DialogResultType.CONFIRM) { return; }

      this.urlShortenerDialogService.open().subscribe((t: DialogResult) => {
        if (!this.funnel) { return; }
        this.funnelApi.updateProperty(this.funnel.id, { published: true }).subscribe(() => {
          this.snackbar.open(this.translate.instant('LABEL.publish_value', { value: this.translate.instant('LABEL.funnel') }), undefined, {
            duration: 7500,
          });
          this.router.navigate(['/', 'viewer', this.funnel!.id]);
        });
      });
    });
  }

  updateFunnel(property: Record<string, any>): void {
    if (!this.funnel) { return; }
    this.funnelApi.updateProperty(this.funnel.id, property).subscribe();
  }

  home(): void {
    this.router.navigate(['/', 'statistics']);
  }
}
