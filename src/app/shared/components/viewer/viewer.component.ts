import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { TWidgetType } from 'src/app/model/widget.interface';
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
  funnel: IFunnel | undefined = undefined;
  pages: Record<string, IPage> = {};
  blocks: Record<string, IBlock> = {};
  widgets: Record<string, TWidgetType> = {};
  private componentId: string = GlobalUtils.uuidv4();

  selectedPageId: string | undefined;
  private alive: boolean = true;

  constructor(
    private currentRoute: ActivatedRoute,
    private viewerApi: ViewerService,
  ) { }

  ngOnInit(): void {
    this.currentRoute.params.pipe(takeWhile(() => this.alive)).subscribe(params => this.viewerApi.getFunnelById(params.funnelId).subscribe());
    this.viewerApi.funnelChanged().pipe(takeWhile(() => this.alive)).subscribe((item: IFunnel | undefined) => this.funnel = item);
    this.viewerApi.pagesChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IPage>) => { this.pages = items; this.init() });
    this.viewerApi.blocksChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IBlock>) => this.blocks = items);
    this.viewerApi.widgetsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, TWidgetType>) => this.widgets = items);
  }

  private init(): void {
    if (Object.keys(this.pages).length <= 0 && !this.selectedPageId) { return this.selectedPageId = undefined; }

    this.selectedPageId = Object.keys(this.pages)
      .map((pageId: string) => this.pages[pageId])
      .sort((a: IPage, b: IPage) => a.index < b.index ? -1 : 1)[0].id;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  record: Record<string, any> = {};
  afterClicked(widgetId: string): void {
    if (!this.funnel) { return; }
    const widget: TWidgetType = this.widgets[widgetId];
    if (widget.kind === 'button') {
      if (widget.final) {
        this.viewerApi.save(this.funnel.id, this.record).subscribe(() => this.record = {});
        return;
      }
      if (widget.linkedTo) { this.selectedPageId = widget.linkedTo; }
    }
  }

  afterChanged(event: Record<string, any>, widgetId: string): void {
    this.record = Object.assign(this.record, event);
  }
}
