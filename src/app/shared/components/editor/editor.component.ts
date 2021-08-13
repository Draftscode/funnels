import { CdkDrag } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, forkJoin, Observable, of } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { IWidget, TWidgetType } from 'src/app/model/widget.interface';
import { ActionService } from 'src/app/services/action.service';
import { BlockService } from 'src/app/services/block.service';
import { FunnelService } from 'src/app/services/funnel.service';
import { PageService } from 'src/app/services/page.service';
import { WidgetService } from 'src/app/services/widget.service';
import { GlobalUtils } from 'src/app/utils/global.utils';
import { IPage } from '../page/page.interface';
import { IBlock } from './block.interface';

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
  funnels: Record<string, IFunnel> = {};
  blocks: Record<string, IBlock> = {};
  widgets: Record<string, TWidgetType> = {};

  selectedFunnelId: string | undefined;
  selectedBlockId: string | undefined;
  selectedWidgetId: string | undefined;
  selectedPageId: string | undefined;

  constructor(
    private funnelApi: FunnelService,
    private pageApi: PageService,
    private blockApi: BlockService,
    private widgetApi: WidgetService,
    private actionApi: ActionService,
    private router: Router,
    private currentRoute: ActivatedRoute,
  ) {
    this.funnelApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IFunnel>) => {
      this.funnels = items;
    });
    this.pageApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IPage>) => {
      this.pages = items; this.init();
    });
    this.blockApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IBlock>) => {
      this.blocks = items;
    });
    this.widgetApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, TWidgetType>) => {
      this.widgets = items;
    });
  }

  // get blockIsActive(): boolean {
  //   if (this && !this.blocks[this.selectedBlockId].widgetIds) {
  //     return true;
  //   }
  //   return false;
  // }

  private init(): void {
    if (!this.pages || !this.selectedFunnelId) {
      const keys: string[] = Object.keys(this.pages || {});
      if (!this.selectedPageId && keys.length > 0) {
        this.selectedPageId = keys.sort((a: string, b: string) => this.pages[a].index < this.pages[b].index ? -1 : 1)[0];
      }
    }
  }

  renameFunnel(funnelId: string, name: string): void { this.funnelApi.updateProperty(funnelId, { name }).subscribe(); }
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

  createPage(): void {
    if (!this.selectedFunnelId) { return; }

    const p: IPage = {
      id: GlobalUtils.uuidv4(),
      index: 0,
      name: 'Neue Seite 001',
      funnelId: this.selectedFunnelId,
    };

    const pageIds: string[] = (this.funnels[this.selectedFunnelId].pageIds || []).concat(p.id);
    p.index = pageIds.length - 1;

    concat(
      this.funnelApi.updateProperty(this.selectedFunnelId, { pageIds }),
      this.pageApi.create(p.id, p),
    ).subscribe();
  }

  ngOnInit(): void {
    this.currentRoute.params.pipe(takeWhile(() => this.alive)).subscribe(params => {
      this.selectedFunnelId = params.funnelId; this.init();
    });
  }

  ngOnDestroy(): void {
    this.actionApi.closeEditor();
    this.alive = false;
  }

  @ViewChild('pageContainer', { read: ElementRef }) pageContainer: ElementRef | undefined;

  activateWidget(ev: MouseEvent | undefined, el: ElementRef, blockId: string, widgetId: string | undefined = undefined): void {
    if (!this.selectedPageId) { return; }
    if (ev) { ev.stopPropagation(); }
    this.selectedBlockId = blockId;
    this.selectedWidgetId = widgetId;

    // this.actionApi.selectBlock(this.pageContainer?.nativeElement, this.pages[this.selectedPageId], this.blocks[blockId], widgetId ? this.widgets[widgetId] : undefined);
  }

  createWidget(): void {
    if (!this.selectedBlockId) { return; }
    this.actionApi.createWidget(this.blocks[this.selectedBlockId]).subscribe();
  }

  deleteWidget(): void {
    const id: string | undefined = this.selectedWidgetId;
    if (!id || !this.selectedBlockId) { return; }
    this.selectedWidgetId = undefined;
    const widgetIds: string[] = this.blocks[this.selectedBlockId].widgetIds?.filter((widgetId: string) => widgetId !== id) || [];
    this.blockApi.updateProperty(this.selectedBlockId, { widgetIds }).subscribe(() => {
      this.widgetApi.deleteItem(id).subscribe();
    });
  }

  deletePage(pageId: string): void {
    if (!this.selectedFunnelId) { return; }
    const pageIds: string[] = (this.funnels[this.selectedFunnelId].pageIds || []).filter((id: string) => id !== pageId);
    const page: IPage = this.pages[pageId];
    concat([
      this.funnelApi.updateProperty(this.selectedFunnelId, { pageIds }),
      ...(page.blockIds?.map((blockId: string) => this.deleteBlock(blockId, pageId)) || []),
    ]).subscribe();
  }

  deleteBlock(blockId: string, pageId: string): Observable<any> {

    if (!blockId) { return of(null); }
    this.selectedBlockId = undefined;

    console.log('HERE');
    const blockIds: string[] = this.pages[pageId].blockIds?.filter((bId: string) => bId !== blockId) || [];

    return this.pageApi.updateProperty(pageId, { blockIds }).pipe(switchMap(() => {
      console.log('UPDATED PROPERTY');
      const widgetIds: string[] = this.blocks[blockId].widgetIds || [];
      if (widgetIds.length <= 0) { return of(null); }
      console.log('DELETE BLOCK', blockId);
      return forkJoin(widgetIds.map((widgetId: string) => {
        return this.widgetApi.deleteItem(widgetId);
      })).pipe(switchMap(() => {
        return this.blockApi.deleteItem(blockId);
      }));
    }));
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

  private checkIntersection(list: QueryList<ElementRef>, clazz?: string, options?: { listOfIds?: string[]; skip: boolean }): ElementRef | undefined {
    let match: ElementRef | undefined = undefined;
    list.toArray().forEach((item: ElementRef) => {
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

  dragMove(event: { pointerPosition: { x: number; y: number } }, blockId: string): void {
    this.pos = event?.pointerPosition || undefined;
    this.checkIntersection(this.viewChildren, 'activated');
    this.checkIntersection(this.widgetChildren, 'has-drag-over', { listOfIds: this.blocks[blockId].widgetIds, skip: false });
    this.checkIntersection(this.blockChildren, 'has-drag-over', { skip: false });
  }


  selectPage(pageId: string): void {
    setTimeout(() => {
      this.selectedPageId = pageId;
    });
  }

  blockDropped(event: any, blockId: string, pageId: string): void {
    this.previewId = undefined;
    const { pos, el } = this.getBlockPosition();

    if (el) {
      const index: number = this.blockChildren.toArray().findIndex((e: ElementRef) => e.nativeElement.id === el.nativeElement.id);
      const curIndex: number = this.blockChildren.toArray().findIndex((e: ElementRef) => e.nativeElement.id === blockId);
      const finalIndex: number = index + (curIndex > index ? (pos === 'end' ? 1 : 0) : (pos === 'start' ? -1 : 0));
      const blockIds: string[] = this.pages[pageId].blockIds || [];
      blockIds[curIndex] = blockIds[finalIndex];
      blockIds[finalIndex] = blockId;
      this.pageApi.updateProperty(pageId, { blockIds }).subscribe();
    }
  }


  previewId: string | undefined = undefined;
  previewPosition: 'start' | 'end' | undefined = undefined;
  startBlockDrag(event: any, blockId: string): void {
  }

  getBlockPosition(): { pos: 'start' | 'end' | undefined; el: ElementRef | undefined } {
    const el: ElementRef | undefined = this.checkIntersection(this.blockChildren);
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


  blockMoved(event: { pointerPosition: { x: number; y: number } }, blockId: string): void {
    this.pos = event.pointerPosition;
    const { pos, el } = this.getBlockPosition();
    this.previewPosition = pos;
    this.previewId = el ? el.nativeElement.id : undefined;
  }

  dragExited(event: { dropPoint: { x: number; y: number } }, widgetId: string, curBlockId: string): void {
    const pageId: number = this.viewChildren.toArray().find((item: ElementRef) => this.isPointerOverContainer(item.nativeElement))?.nativeElement?.id;
    const targetedBlockId: string = this.blockChildren.toArray().find((item: ElementRef) => this.isPointerOverContainer(item.nativeElement))?.nativeElement?.id;
    const targetedWidgetId: string = this.widgetChildren.toArray().find((item: ElementRef) => this.isPointerOverContainer(item.nativeElement))?.nativeElement?.id;

    this.dragMove({ pointerPosition: { x: 0, y: 0 } }, curBlockId);
    // console.log('DRAG EXITED', widgetId, this.blocks[curBlockId].widgetIds, this.blocks[curBlockId].widgetIds?.indexOf(widgetId));
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
    if (!this.selectedPageId) { return; }
    const b: IBlock = {
      id: GlobalUtils.uuidv4(),
      height: 250,
      index: 0,
      widgets: {},
    };

    const blockIds: string[] = (this.pages[this.selectedPageId].blockIds || []).concat(b.id);

    concat(
      this.pageApi.updateProperty(this.selectedPageId, { blockIds }),
      this.blockApi.create(b.id, b),
    ).subscribe();
  }

  demo(): void {
    this.router.navigate(['/', 'viewer', this.selectedFunnelId]);
  }
  home(): void {
    this.router.navigate(['/', 'statistics']);
  }
}
