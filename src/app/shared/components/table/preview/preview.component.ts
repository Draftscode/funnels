import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { IWidget, TWidgetType } from 'src/app/model/widget.interface';
import { BlockService } from 'src/app/services/block.service';
import { PageService } from 'src/app/services/page.service';
import { WidgetService } from 'src/app/services/widget.service';
import { IBlock } from '../../editor/block.interface';
import { IPage } from '../../page/page.interface';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {
  @Input() pageId: string | undefined;
  pages: Record<string, IPage> = {};
  blocks: Record<string, IBlock> = {};
  widgets: Record<string, TWidgetType> = {};
  private alive: boolean = true;

  constructor(
    private pageApi: PageService,
    private blockApi: BlockService,
    private widgetApi: WidgetService,
  ) {
    this.pageApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IPage>) => this.pages = items);
    this.blockApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IBlock>) => this.blocks = items);
    this.widgetApi.itemsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, TWidgetType>) => this.widgets = items);
  }
  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
  }

}
