import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { TWidgetType } from 'src/app/model/widget.interface';
import { BlockService } from 'src/app/services/block.service';
import { FunnelService } from 'src/app/services/funnel.service';
import { PageService } from 'src/app/services/page.service';
import { WidgetService } from 'src/app/services/widget.service';
import { GlobalUtils } from 'src/app/utils/global.utils';
import { IBlock } from '../editor/block.interface';
import { IPage } from '../page/page.interface';
import { ViewerService } from './viewer.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'bg';
  funnels: Record<string, IFunnel> = {};
  pages: Record<string, IPage> = {};
  blocks: Record<string, IBlock> = {};
  widgets: Record<string, TWidgetType> = {};
  private componentId: string = GlobalUtils.uuidv4();

  selectedPageId: string | undefined;
  selectedFunnelId: string | undefined;
  private alive: boolean = true;

  constructor(
    private funnelApi: FunnelService,
    private pageApi: PageService,
    private blockApi: BlockService,
    private widgetApi: WidgetService,
    private currentRoute: ActivatedRoute,
    private viewerApi: ViewerService,
  ) { }

  ngOnInit(): void {
    this.currentRoute.params.pipe(takeWhile(() => this.alive)).subscribe(params => { this.selectedFunnelId = params.funnelId; this.init(); });
    this.funnelApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IFunnel>) => { this.funnels = items; this.init(); });
    this.pageApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IPage>) => { this.pages = items; this.init(); });
    this.blockApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IBlock>) => { this.blocks = items; this.init(); });
    this.widgetApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, TWidgetType>) => { this.widgets = items; this.init(); });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  private init(): void {
    if (!this.selectedFunnelId || !this.funnels || !this.pages) { return; }

    const pageIds: string[] = this.funnels[this.selectedFunnelId]?.pageIds || [];

    this.selectedPageId = Object.keys(this.pages).filter((key: string) => pageIds.includes(this.pages[key].id))
      .sort((a: string, b: string) => this.pages[a].index < this.pages[b].index ? -1 : 1)[0];
  }

  record: Record<string, any> = {};
  afterClicked(widgetId: string): void {
    if (!this.selectedFunnelId) { return; }
    const widget: TWidgetType = this.widgets[widgetId];
    if (widget.kind === 'button') {
      if (widget.final) {
        this.viewerApi.save(this.selectedFunnelId, this.record).subscribe(() => this.record = {});
        return;
      }
      if (widget.linkedTo) { this.selectedPageId = widget.linkedTo; }
    }
  }

  afterChanged(event: Record<string, any>, widgetId: string): void {
    this.record = Object.assign(this.record, event);
  }
}
