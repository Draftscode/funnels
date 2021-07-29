import { CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { IWidget } from 'src/app/model/widget.interface';
import { FunnelService } from 'src/app/services/funnel.service';
import { PageActionService } from 'src/app/services/page-action.service';
import { IPage } from '../page/page.interface';
import * as fromFunnel from './../funnel/funnel.reducer';
import * as funnelActions from './../funnel/funnel.actions';
import { IBlock } from './block.interface';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit, OnDestroy {
  displayedBlocks: IBlock[] = [];
  alive: boolean = true;
  pages: IPage[];
  curDragHeight: number = 0;
  // pageObs: Observable<IPage[]> = this.store.select(fromPage.selectAll);
  // hasActivatedBVlo: Observable<IPage[]> = this.store.select(fromPage.selectAll);
  funnels$ = this.funnelApi.getFunnels();
  funnelId: string = '';
  currentPage: IPage | undefined;
  @ViewChildren('listItem') viewChildren!: QueryList<ElementRef>;
  pages$: Observable<IPage[]> | undefined;
  currentPageIdx: number = 0;
  init$: Subject<void> = new Subject<void>();
  constructor(
    private funnelApi: FunnelService,
    private currentRoute: ActivatedRoute,
    private pageActionApi: PageActionService,
    private cd: ChangeDetectorRef,
    private funnelStore: Store<fromFunnel.FunnelState>,
  ) {
    this.pages = [];
  }

  init(): void {
    // this.funnelStore.select(fromFunnel.selectCurrentFunnel()).subscribe((d) => {
    //   console.log(d);
    // });
    // this.selectPage(this.pages[0]);
  }


  drop(event: any): void {
    moveItemInArray(this.displayedBlocks, event.previousIndex, event.currentIndex);
  }

  deleteBlock(page: IPage, blockId: string): void {
    this.funnelApi.deleteBlock(this.funnelId, page.id, blockId);
  }

  /** Predicate function that only allows even numbers to be dropped into a list. */
  enterPredicate(index: number, item: CdkDrag<IBlock>): boolean {
    if (!item.data) { return false; }
    return true;
  }

  selectedBlockId: string | undefined;
  selectedWidgetId: string | undefined;

  selectBlock(ev: HTMLElement, b: IBlock): void {
    if (!this.currentPage?.blocks) { return; }
    this.selectedBlockId = b.id;

    this.pageActionApi.openEditor(ev, this.funnelId, this.currentPage.id, b.id);
  }

  dragStart(ev: HTMLElement, b: IBlock): void { this.selectBlock(ev, b); }
  dragEnd(ev: HTMLElement, b: IBlock): void { this.selectBlock(ev, b); }

  onResize(e: { distance: { x: number; y: number; } }, block: IBlock): void {
    this.curDragHeight = (e?.distance?.y || 0);
  }

  resize(e: { distance: { x: number; y: number; } }, block: IBlock): void {
    this.curDragHeight = 0;
    this.currentPage

    // this.funnelStore.dispatch(new funnelActions.Update(this.funnelId, {
    //   id: this.funnelId,
    block.height = (block.height + e.distance.y);

  }

  createPage(): void {
    this.funnelApi.createPage(this.funnelId);
  }

  ngOnInit(): void {
    this.currentRoute.params.subscribe(params => {
      this.funnelId = params.funnelId;
      this.init$.next();
      this.funnelStore.select(fromFunnel.selectAllPagesFromFunnel(this.funnelId)).pipe(takeUntil(this.init$)).subscribe((pages: IPage[]) => {
        this.pages = pages;
        console.log(this.pages);
        this.selectPage(pages[0]);
      });
      this.init();
    });

    this.funnels$.pipe(takeWhile(() => this.alive)).subscribe((f: IFunnel[]) => {
      // this.funnels = f; this.init();
    });
  }

  ngOnDestroy(): void {
    this.init$.next();
    this.init$.complete();
    this.pageActionApi.closeCtx();
    this.alive = false;
  }


  activateWidget(ev: MouseEvent, pageId: string, blockId: string, widget: IWidget): void {
    this.selectedWidgetId = widget.id;
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

  selectPage(page: IPage): void {
    this.currentPage = page;
    const b: Record<string, IBlock> = this.currentPage?.blocks || {};
    this.displayedBlocks = Object.keys(b).map((key: string) => b[key]);
    this.cd.detectChanges();
  }

  dragExited(event: { dropPoint: { x: number; y: number } }, widget: IWidget): void {
    const idx: number = this.viewChildren.toArray().findIndex((item: ElementRef) => this.isPointerOverContainer(item.nativeElement));

    this.dragMove({ pointerPosition: { x: 0, y: 0 } });
    if (idx === -1) { return; }
    widget.linkedTo = this.pages[idx].id;

  }


  createBlock(): void {
    if (!this.currentPage) { return; }
    this.funnelApi.addBlock(this.funnelId, this.currentPage.id);
  }
}
