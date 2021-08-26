import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { TWidgetType } from 'src/app/model/widget.interface';
import { PageService } from 'src/app/services/page.service';
import { IPage } from '../../page/page.interface';
import { EditorService } from '../editor.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChildren('listItem') set children(viewChildren: QueryList<ElementRef>) {
    this.editorApi.changePageItems(viewChildren);
  }

  pages: Record<string, IPage> = {};
  widgets: Record<string, TWidgetType> = {};
  selectedPageId: string | undefined;
  selectedWidgetId: string | undefined;
  funnel: IFunnel | undefined;
  private alive: boolean = true;

  constructor(public editorApi: EditorService, private pageApi: PageService) {
    this.editorApi.funnelChanged().pipe(takeWhile(() => this.alive)).subscribe((item: IFunnel | undefined) => this.funnel = item);
    this.editorApi.selectedPageIdChanged().pipe(takeWhile(() => this.alive)).subscribe((item: string | undefined) => this.selectedPageId = item);
    this.editorApi.selectedWidgetIdChanged().pipe(takeWhile(() => this.alive)).subscribe((item: string | undefined) => this.selectedWidgetId = item);
    this.editorApi.pagesChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IPage>) => this.pages = items);
    this.editorApi.widgetsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, TWidgetType>) => this.widgets = items);
  }

  get highlightedPageId(): string | undefined {
    if (!this.selectedWidgetId) { return undefined; }
    const w: TWidgetType = this.widgets[this.selectedWidgetId];
    return w && w.kind === 'button' && w.linkedTo ? w.linkedTo : undefined;
  }

  ngOnInit(): void {
  }

  renamePage(pageId: string, name: string): void { this.pageApi.updateProperty(pageId, { name }).subscribe(); }


  ngOnDestroy(): void {
    this.alive = false;
  }
}
