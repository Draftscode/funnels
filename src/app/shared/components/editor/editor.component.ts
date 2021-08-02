import { CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concat } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { IWidget } from 'src/app/model/widget.interface';
import { ActionService } from 'src/app/services/action.service';
import { BlockService } from 'src/app/services/block.service';
import { FunnelService } from 'src/app/services/funnel.service';
import { PageActionService } from 'src/app/services/page-action.service';
import { PageService } from 'src/app/services/page.service';
import { WidgetService } from 'src/app/services/widget.service';
import { GlobalUtils } from 'src/app/utils/global.utils';
import { IPage } from '../page/page.interface';
import { IBlock } from './block.interface';
import { CtxComponent } from './ctx/ctx.component';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
  displayedBlocks: IBlock[] = [];
  alive: boolean = true;

  curDragHeight: number = 0;

  @ViewChildren('listItem') viewChildren!: QueryList<ElementRef>;
  nameEditable: boolean = false;

  pos: { x: number; y: number } | undefined;

  pages: Record<string, IPage> = {};
  funnels: Record<string, IFunnel> = {};
  blocks: Record<string, IBlock> = {};
  widgets: Record<string, IWidget> = {};

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
      this.pages = items;
    });
    this.blockApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IBlock>) => {
      this.blocks = items;
    });
    this.widgetApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IWidget>) => {
      this.widgets = items;
    });
  }

  renameFunnel(funnelId: string, name: string): void { this.funnelApi.updateProperty(funnelId, { name }).subscribe(); }
  renamePage(pageId: string, name: string): void { this.pageApi.updateProperty(pageId, { name }).subscribe(); }

  drop(event: any): void {
    moveItemInArray(this.displayedBlocks, event.previousIndex, event.currentIndex);
  }

  deleteBlock(page: IPage, blockId: string): void {
    // this.funnelApi.deleteBlock(this.funnelId, page.id, blockId);
  }

  /** Predicate function that only allows even numbers to be dropped into a list. */
  enterPredicate(index: number, item: CdkDrag<IBlock>): boolean {
    if (!item.data) { return false; }
    return true;
  }

  dragStart(ev: HTMLElement, b: string): void { /**this.selectBlock(ev, b);*/ }
  dragEnd(ev: HTMLElement, b: string): void {/** this.selectBlock(ev, b);*/ }

  onResize(e: { distance: { x: number; y: number; } }, blockId: string): void {
    this.curDragHeight = (e?.distance?.y || 0);
  }

  resize(e: { distance: { x: number; y: number; } }, blockId: string): void {
    this.blockApi.updateProperty(blockId, { height: this.curDragHeight + this.blocks[blockId].height }).subscribe();
    this.curDragHeight = 0;
  }

  createPage(): void {
    if (!this.selectedFunnelId) { return; }

    const p: IPage = {
      id: GlobalUtils.uuidv4(),
      blocks: {},
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
      this.selectedFunnelId = params.funnelId;
    });
  }

  ngOnDestroy(): void {
    this.actionApi.closeEditor();
    this.alive = false;
  }

  activateWidget(ev: MouseEvent | undefined, el: ElementRef, blockId: string, widgetId: string | undefined = undefined): void {
    if (ev) { ev.stopPropagation(); }
    this.selectedBlockId = blockId;
    this.selectedWidgetId = widgetId;
    this.actionApi.selectBlock(el.nativeElement, this.blocks[blockId], widgetId);
  }

  isPointerOverContainer(container: HTMLElement): boolean {
    if (!this.pos) { return false; }
    const rect: DOMRect = container.getBoundingClientRect();
    if (this.pos.x >= rect.x && this.pos.x <= rect.x + rect.width
      && this.pos.y >= rect.y && this.pos.y <= rect.y + rect.height) {
      return true;
    }

    return false;
  }

  dragMove(event: { pointerPosition: { x: number; y: number } }): void {
    this.pos = event?.pointerPosition || undefined;
    this.viewChildren.toArray().forEach((item: ElementRef) => {
      item.nativeElement.classList.remove('activated');
      if (this.isPointerOverContainer(item.nativeElement)) {
        item.nativeElement.classList.add('activated');
      }
    });
  }


  selectPage(pageId: string): void {
    setTimeout(() => {
      this.selectedPageId = pageId;
    });
  }

  dragExited(event: { dropPoint: { x: number; y: number } }, widgetId: string): void {
    const pageId: number = this.viewChildren.toArray().find((item: ElementRef) => this.isPointerOverContainer(item.nativeElement))?.nativeElement?.id;

    this.dragMove({ pointerPosition: { x: 0, y: 0 } });
    if (!pageId) { return; }


    this.widgetApi.updateProperty(widgetId, { linkedTo: this.pages[pageId].id }).subscribe();
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
}
