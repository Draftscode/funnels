import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { IFunnel } from "../model/funnel.interface";
import { IWidget } from "../model/widget.interface";
import { IBlock } from "../shared/components/editor/block.interface";
import { IPage } from "../shared/components/page/page.interface";

@Injectable({
  providedIn: 'root',
})
export class FunnelService {
  private funnels: BehaviorSubject<IFunnel[]> = new BehaviorSubject<IFunnel[]>([]);

  constructor(private http: HttpClient) {
    this.http.get<IFunnel[]>('./assets/pages.json').subscribe((a: IFunnel[]) => {
      this.funnels.next(a);
    });
  }

  getFunnels(): Observable<IFunnel[]> {
    return this.funnels.asObservable();
  }

  updateFunnel(funnelId: string, funnel: IFunnel): void {
    const funnels: IFunnel[] = this.funnels.getValue()
      .filter((f: IFunnel) => f.id !== funnelId)
      .concat(funnel);
    this.funnels.next(funnels);
  }

  deleteBlock(funnelId: string, pageId: string, blockId: string): void {
    const funnel: IFunnel | undefined = this.funnels.getValue().find((f: IFunnel) => f.id === funnelId);
    if (!funnel) { return; }

    if (!funnel.pages[pageId]) { return; }
    delete funnel.pages[pageId].blocks[blockId];
    this.funnels.next(this.funnels.getValue());
  }

  deleteWidgetOrBlock(funnelId: string, pageId: string, blockId: string): void {
    const funnel: IFunnel | undefined = this.funnels.getValue().find((f: IFunnel) => f.id === funnelId);
    if (!funnel) { return; }

    if (!funnel.pages[pageId]) { return; }
    const block: IBlock = funnel.pages[pageId].blocks[blockId];

    if (!block) { return; }
    const widgetKey: string | undefined = Object.keys(block.widgets || {}).find((key: string) => block.widgets[key].activated);

    if (widgetKey) {
      delete block.widgets[widgetKey];
    } else {
      delete funnel.pages[pageId].blocks[blockId];
    }
    this.funnels.next(this.funnels.getValue());
  }

  activateWidget(funnelId: string, pageId: string, blockId: string, widgetId: string, state: boolean): void {
    const funnel: IFunnel | undefined = this.funnels.getValue().find((f: IFunnel) => f.id === funnelId);
    if (!funnel) { return; }

    const page: IPage = funnel.pages[pageId];
    if (!page) { return; }

    Object.keys(page.blocks || {}).forEach((_blockId: string) => {
      const block: IBlock = page.blocks[_blockId];
      if (!block) { return; }
      Object.keys(block.widgets || {}).forEach((_widgetId: string) => {
        const widget: IWidget = block.widgets[_widgetId];
        if (!widget) { return; }
        widget.activated = false;
      });
    });

    const block: IBlock = page.blocks[blockId];
    if (!block) { return; }

    const widget: IWidget = block.widgets[widgetId];
    if (!widget) { return; }

    widget.activated = true;
    this.funnels.next(this.funnels.getValue());

  }

  public getBlock(funnelId: string, pageId: string, blockId: string): IBlock | undefined {
    const funnel: IFunnel | undefined = this.funnels.getValue().find((f: IFunnel) => f.id === funnelId);
    if (!funnel) { return; }

    const page: IPage = funnel.pages[pageId];
    if (!page) { return; }

    Object.keys(page.blocks || {}).forEach((_blockId: string) => {
      const block: IBlock = page.blocks[_blockId];
      if (!block) { return; }
      Object.keys(block.widgets || {}).forEach((_widgetId: string) => {
        const widget: IWidget = block.widgets[_widgetId];
        if (!widget) { return; }
        widget.activated = false;
      });
    });

    return page.blocks[blockId];

  }

  addWidget(funnelId: string, pageId: string, blockId: string, widget: IWidget): void {
    const block: IBlock | undefined = this.getBlock(funnelId, pageId, blockId);
    if (!block) { return; }

    block.widgets[widget.id] = widget;
    this.funnels.next(this.funnels.getValue());
  }
}
