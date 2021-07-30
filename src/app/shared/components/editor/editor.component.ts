import { CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { map, takeWhile, tap } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { IWidget } from 'src/app/model/widget.interface';
import { FunnelService } from 'src/app/services/funnel.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { PageActionService } from 'src/app/services/page-action.service';
import { GlobalUtils } from 'src/app/utils/global.utils';
import { AddWidgetsToBlock, CreateBlock, UpdateBlockProperties } from '../../state/block/block.actions';
import { BLOCK_STORAGE_NAME } from '../../state/block/block.state';
import { AddPagesToFunnel, UpdateFunnel } from '../../state/funnel/funnel.actions';
import { FunnelState, FUNNEL_STORAGE_NAME } from '../../state/funnel/funnel.state';
import { AddBlocksToPage, CreatePage, UpdatePageProperty } from '../../state/page/page.actions';
import { PAGE_STORAGE_NAME } from '../../state/page/page.state';
import { CreateWidget } from '../../state/widget/widget.actions';
import { WIDGET_STORAGE_NAME } from '../../state/widget/widget.state';
import { IPage } from '../page/page.interface';
import { IBlock } from './block.interface';
import { CreateDialogComponent } from './create-dialog/create-dialog.component';
import { CtxComponent } from './ctx/ctx.component';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
  displayedBlocks: IBlock[] = [];
  alive: boolean = true;
  pages: IPage[] | undefined;
  curDragHeight: number = 0;
  funnels$ = this.funnelApi.getFunnels();
  funnelId: string = '';
  @ViewChildren('listItem') viewChildren!: QueryList<ElementRef>;
  nameEditable: boolean = false;
  currentPageIdx: number = 0;
  next$: Subject<void> = new Subject<void>();
  pageIds: string[] = [];
  blocks: IBlock[] | undefined;
  curFunnel: IFunnel | undefined;
  @Select((state: any) => state[WIDGET_STORAGE_NAME].entities) widgets$!: Observable<Record<string, IWidget>>;
  @Select((state: any) => state[BLOCK_STORAGE_NAME].entities) blocks$!: Observable<Record<string, IBlock>>;
  pages$!: Observable<Record<string, IPage>>;
  funnel$!: Observable<Record<string, IFunnel>>;

  constructor(
    private funnelApi: FunnelService,
    private currentRoute: ActivatedRoute,
    private pageActionApi: PageActionService,
    private store: Store,
    private overlayApi: OverlayService,
    private dialog: MatDialog,
  ) {
    this.funnel$ = this.store.select(state => state[FUNNEL_STORAGE_NAME].entities);
    this.pages$ = this.store.select(state => state[PAGE_STORAGE_NAME].entities).pipe(tap((pages: Record<string, IPage>) => {
      if (!this.currentPageId && pages) { setTimeout(() => this.currentPageId = Object.keys(pages)[0]); }
    }));
  }

  renameFunnel(funnelId: string, name: string): void { console.log(funnelId, name); this.store.dispatch(new UpdateFunnel(funnelId, { name })); }

  renamePage(pageId: string, name: string): void { this.store.dispatch(new UpdatePageProperty(pageId, { name })); }



  drop(event: any): void {
    moveItemInArray(this.displayedBlocks, event.previousIndex, event.currentIndex);
  }

  deleteBlock(page: IPage, blockId: string): void {
    this.funnelApi.deleteBlock(this.funnelId, page.id, blockId);
  }

  private ctx: CtxComponent | undefined;
  /** Predicate function that only allows even numbers to be dropped into a list. */
  enterPredicate(index: number, item: CdkDrag<IBlock>): boolean {
    if (!item.data) { return false; }
    return true;
  }

  selectedBlockId: string | undefined;
  selectedWidgetId: string | undefined;

  selectBlock(ev: HTMLElement, block: IBlock): void {
    this.selectedBlockId = block.id;
    this.closeEditor();
    if (!this.selectedBlockId) { return; }

    this.ctx = this.overlayApi.create(CtxComponent, ev, {}, {
      overlayOrigin: 'right',
      backdrop: false,
      postion: {
        right: 'end'
      }
    }).componentRef.instance;
    this.ctx.beforeAction.subscribe((action: string) => {
      this.dialog.open(CreateDialogComponent, {
        data: { block, }, panelClass: 'lightbox'
      }).afterClosed().subscribe((r) => {
        if (!r) { return; }
        console.log(r);
        this.store.dispatch([
          new AddWidgetsToBlock(block.id, r.widget.id),
          new CreateWidget(r.widget),
        ]);
      });
    });
  }

  closeEditor(): void {
    this.ctx?.close();
  }

  dragStart(ev: HTMLElement, b: string): void { /**this.selectBlock(ev, b);*/ }
  dragEnd(ev: HTMLElement, b: string): void {/** this.selectBlock(ev, b);*/ }

  onResize(e: { distance: { x: number; y: number; } }, blockId: string): void {
    this.curDragHeight = (e?.distance?.y || 0);
  }

  resize(e: { distance: { x: number; y: number; } }, blockId: string): void {
    this.store.dispatch(new UpdateBlockProperties(blockId, 'add', { height: this.curDragHeight }));
    this.curDragHeight = 0;
  }

  createPage(): void {
    const p: IPage = {
      id: GlobalUtils.uuidv4(),
      blocks: {},
      index: 0,
      name: 'Neue Seite 001',
      funnelId: this.funnelId,
    };

    this.store.dispatch([
      new AddPagesToFunnel(this.funnelId, p.id),
      new CreatePage(p),
    ]);
  }

  ngOnInit(): void {
    this.currentRoute.params.subscribe(params => {
      this.funnelId = params.funnelId;
    });

    this.funnels$.pipe(takeWhile(() => this.alive)).subscribe((f: IFunnel[]) => {
      // this.funnels = f; this.init();
    });
  }

  ngOnDestroy(): void {
    this.ctx?.close();
    this.next$.next();
    this.next$.complete();
    this.pageActionApi.closeCtx();
    this.alive = false;
  }


  activateWidget(ev: MouseEvent, widgetId: string): void {
    this.selectedWidgetId = widgetId;
    // this.funnelApi.activateWidget(this.funnelId, pageId, blockId, widget.id, true);
  }

  pos: { x: number; y: number } | undefined;

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

  widgets: Record<string, any> = {};
  currentPageId: string | undefined;
  selectPage(pageId: string): void {
    setTimeout(() => {
      console.log('SELECT PAGE');
      this.next$.next();
      // this.currentPage = page;
      this.currentPageId = pageId;
    });
  }

  dragExited(event: { dropPoint: { x: number; y: number } }, widget: IWidget): void {
    const idx: number = this.viewChildren.toArray().findIndex((item: ElementRef) => this.isPointerOverContainer(item.nativeElement));

    this.dragMove({ pointerPosition: { x: 0, y: 0 } });
    if (idx === -1) { return; }
    // widget.linkedTo = this.pages[idx].id;

  }


  createBlock(): void {
    if (!this.currentPageId) { return; }
    const b: IBlock = {
      id: GlobalUtils.uuidv4(),
      height: 250,
      index: 0,
      widgets: {},
    };

    this.store.dispatch([
      new AddBlocksToPage(this.currentPageId, [b.id]),
      new CreateBlock(b),
    ]);

    // this.funnelApi.addBlock(this.funnelId, this.currentPage.id);
  }
}
