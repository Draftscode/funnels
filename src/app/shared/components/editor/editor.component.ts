import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFunnel } from 'src/app/model/funnel.interface';
import { FunnelService } from 'src/app/services/funnel.service';
import { IPage } from '../page/page.interface';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit {
  pages: IPage[];
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

  }

  init(): void {
    if (!this.funnelId || !this.funnels.length) { return; }
    const p: Record<string, IPage> = this.funnels.find((f: IFunnel) => f.id === this.funnelId)!.pages;
    if (!p) { return; }
    Object.keys(p).forEach((id: string) => { this.pages.push(p[id]); });
    console.log(this.pages);
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.currentRoute.params.subscribe(params => { this.funnelId = params.funnelId; this.init(); });
    this.funnel$.subscribe((f: IFunnel[]) => {
      this.funnels = f; this.init();
    });
  }
}
