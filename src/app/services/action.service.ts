import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { concat } from "rxjs";
import { IWidget } from "../model/widget.interface";
import { IBlock } from "../shared/components/editor/block.interface";
import { CreateDialogComponent } from "../shared/components/editor/create-dialog/create-dialog.component";
import { CtxComponent, TAction } from "../shared/components/editor/ctx/ctx.component";
import { ImageDialog } from "../shared/components/images/dialog/image.dialog";
import { IImage } from "../shared/components/images/image.interface";
import { IPage } from "../shared/components/page/page.interface";
import { BlockService } from "./block.service";
import { OverlayService } from "./overlay.service";
import { PageService } from "./page.service";
import { WidgetService } from "./widget.service";

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private ctx: CtxComponent | undefined;

  constructor(
    private dialog: MatDialog,
    private overlayApi: OverlayService,
    private blockApi: BlockService,
    private widgetApi: WidgetService,
    private pageApi: PageService,
  ) { }

  selectBlock(ev: MouseEvent, page: IPage, block: IBlock, widget: IWidget | undefined): void {
    this.closeEditor();
    if (!block) { return; }

    this.ctx = this.overlayApi.create(CtxComponent, ev, {
      widget: widget,
      block: block ? true : false,
    }, {
      backdrop: false,
      overlayOrigin: 'right',
    }).componentRef.instance;
    this.ctx.beforeAction.subscribe((data: { action: TAction; data: Record<string, any> }) => {
      this.execute(data, page, block, widget);
    });
  }

  closeEditor(): void {
    this.ctx?.close();
  }

  execute(data: { action: TAction; data: Record<string, any> }, page: IPage, block: IBlock, widget: IWidget | undefined): void {
    const action: TAction = data.action;
    switch (action) {
      case 'add':
        this.dialog.open(CreateDialogComponent, {
          data: { block, }, panelClass: 'lightbox'
        }).afterClosed().subscribe((r) => {
          if (!r) { return; }

          const widgetIds: string[] = (block.widgetIds || []).concat(r.widget.id);

          concat(
            this.blockApi.updateProperty(block.id, { widgetIds }),
            this.widgetApi.create(r.widget.id, r.widget),
          ).subscribe();
          this.closeEditor();
        });
        break;
      case 'delete':
        if (widget) {
          const widgetIds: string[] = (block.widgetIds || []).filter((id: string) => id !== widget.id);
          concat(
            this.blockApi.updateProperty(block.id, { widgetIds }),
            this.widgetApi.deleteItem(widget.id),
          ).subscribe();
        } else {
          const blockIds: string[] = (page.blockIds || []).filter((id: string) => id !== block.id);
          concat(
            this.pageApi.updateProperty(page.id, { blockIds }),
            this.blockApi.deleteItem(block.id),
          ).subscribe();
        }

        this.closeEditor();
        break;
      case 'image':
        if (!widget) { return; }
        this.dialog.open(ImageDialog, {
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '90%',
          width: '90%',
          panelClass: 'lightbox',
          data: {
            image: widget?.image,
          }
        }).afterClosed().subscribe((r) => {
          if (r?.type === 'confirm') {
            this.widgetApi.updateProperty(widget.id, { image: r.image }).subscribe();
          }
        });
        break;
      case 'gradient':
        if (widget) {
          this.widgetApi.updateProperty(widget.id, { background: data.data.background }).subscribe();
        } else {
          this.blockApi.updateProperty(block.id, { background: data.data.background }).subscribe();
        }
        break;
      case 'text-color':
        if (!widget) { return; }
        this.widgetApi.updateProperty(widget.id, { textColor: data.data.color }).subscribe();
        break;
      case 'text':
        if (!widget) { return; }
        this.widgetApi.updateProperty(widget.id, { text: data.data.text }).subscribe();
        break;
      case 'opacity':
        {
          if (!widget || !widget.image) { return; }
          const image: IImage = widget.image;
          image.opacity = data.data.image.opacity;
          this.widgetApi.updateProperty(widget.id, { image }).subscribe();
        }
        break;

      case 'anchor':
        {
          if (!widget || !widget.image) { return; }
          const image: IImage = widget.image;
          image.anchor = data.data.image.anchor
          this.widgetApi.updateProperty(widget.id, { image }).subscribe();

        }
        break;
    }
  }

}
