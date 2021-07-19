import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IPage } from '../components/page/page.interface';
import { GlobalUtils } from '../utils/global.utils';
import * as pageActions from './../components/page/page.actions';
import * as fromPage from './../components/page/page.reducer';
import { IBlock } from './block';
import * as fromBlock from './../components/block/block.reducer';
import * as blockActions from './../components/block/block.actions';

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

  constructor(
    private http: HttpClient,
    // private store: Store<fromPage.PageState>,
    // private blockStore: Store<fromBlock.BlockState>,
    private cd: ChangeDetectorRef,
  ) {
    this.pages = [];
    this.currentPage = null;


    this.http.get<Record<string, any>[]>('./assets/pages.json').subscribe((pages: Record<string, any>[]) => {
      this.pages = pages as IPage[];
      this.currentPage = this.pages[0];
this.cd.detectChanges();
    });
  }

  get hasActiveBlock(): boolean {
    return this.currentPage?.blocks.find((b: IBlock) => b.activated) ? true : false;
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

  createPage() {
    const blocks: IBlock[] = Array.from({ length: 100 }).map((_, i) => {
      return { id: `block-${i}`, height: 0, curDragHeight: 0, activated: false };
    });

    const page: IPage = { blocks, id: GlobalUtils.uuidv4() };
    // this.store.dispatch(new pageActions.Create(page));
  }


  selectPage(page: IPage): void {
    this.currentPage = page;
  }
}
