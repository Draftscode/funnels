import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IPage } from '../page/page.interface';
import { GlobalUtils } from '../../../utils/global.utils';
import * as pageActions from '../page/page.actions';
import * as fromPage from '../page/page.reducer';
import { IBlock } from './block.interface';
import * as fromBlock from '../block/block.reducer';
import * as blockActions from '../block/block.actions';
import { FunnelService } from 'src/app/services/funnel.service';
import { IFunnel } from 'src/app/model/funnel.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit {
  pages: IPage[];
  currentPage: IPage | null;
  // pageObs: Observable<IPage[]> = this.store.select(fromPage.selectAll);
  // hasActivatedBVlo: Observable<IPage[]> = this.store.select(fromPage.selectAll);
  funnel$ = this.funnelApi.getFunnels();
  funnels: IFunnel[] = [];
  funnelId: string = '';
  constructor(
    private funnelApi: FunnelService,
    private router: Router,
    private currentRoute: ActivatedRoute,
    // private store: Store<fromPage.PageState>,
    // private blockStore: Store<fromBlock.BlockState>,
    private cd: ChangeDetectorRef,
  ) {
    this.pages = [];
    this.currentPage = null;
    this.currentRoute.params.subscribe(params => { this.funnelId = params.funnelId; console.log(params); this.init(); });
    this.funnel$.subscribe((f: IFunnel[]) => {
      this.funnels = f; this.init();
    });
  }

  init(): void {
    console.log(this.funnelId, this.funnels);
    if (!this.funnelId || !this.funnels.length) { return; }
    const p: Record<string, IPage> = this.funnels.find((f: IFunnel) => f.id === this.funnelId)!.pages;
    if (!p) { return; }
    Object.keys(p).forEach((id: string) => { this.pages.push(p[id]); });

    this.currentPage = this.pages[0];
    console.log(this.currentPage);
    this.cd.detectChanges();
  }

  get hasActiveBlock(): boolean {
    if (!this.currentPage) { return false; }
    const blocks: Record<string, IBlock> = this.currentPage.blocks;
    return Object.keys(blocks).find((id: string) => blocks[id].activated) ? true : false;
  }

  /**
   * updates pages
   * @param {Page[]} pages list pages to update
   * @returns void
   */
  updatePages(pages: IPage[]): void {
    this.pages = pages;
    // if no page is selected, select the first one
    if (!this.currentPage && Array.isArray(pages)) {
      this.currentPage = this.pages[0];
    }

    console.log(pages)
  }

  ngOnInit(): void {
    // this.pageObs.subscribe((a: IPage[]) => {
    //   this.currentPage = a[0];
    //   this.cd.detectChanges();
    //   console.log(this.currentPage, a);
    // });
  }

  selectPage(page: IPage): void {
    this.currentPage = page;
  }
}
