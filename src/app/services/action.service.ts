import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { concat } from "rxjs";
import { IBlock } from "../shared/components/editor/block.interface";
import { CreateDialogComponent } from "../shared/components/editor/create-dialog/create-dialog.component";
import { CtxComponent, TAction } from "../shared/components/editor/ctx/ctx.component";
import { ImageDialog } from "../shared/components/images/dialog/image.dialog";
import { BlockService } from "./block.service";
import { OverlayService } from "./overlay.service";
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
  ) { }

  selectBlock(ev: MouseEvent, block: IBlock, widgetId: string | undefined = undefined): void {
    this.closeEditor();
    if (!block) { return; }

    this.ctx = this.overlayApi.create(CtxComponent, ev, {
      widget: widgetId ? true : false,
      block: block ? true : false,
    }, {
      overlayOrigin: 'right',
      backdrop: false,
      postion: {
        right: 'end'
      },

    }).componentRef.instance;
    this.ctx.beforeAction.subscribe((data: { action: TAction; data: Record<string, any> }) => {
      this.execute(data, block, widgetId);
    });
  }

  closeEditor(): void {
    this.ctx?.close();
  }

  execute(data: { action: TAction; data: Record<string, any> }, block: IBlock, widgetId: string | undefined = undefined): void {
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

        });
        break;
      case 'delete':
        if (!widgetId) { return; }
        const widgetIds: string[] = (block.widgetIds || []).filter((id: string) => id !== widgetId);
        concat(
          this.blockApi.updateProperty(block.id, { widgetIds }),
          this.widgetApi.deleteItem(widgetId),
        ).subscribe();
        break;
      case 'image':
        if (!widgetId) { return; }
        this.dialog.open(ImageDialog, {
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '90%',
          width: '90%',
          panelClass: 'lightbox',
          data: {
            image: this.widgetApi.getItemById(widgetId)?.image,
          }
        }).afterClosed().subscribe((r) => {
          if (r?.type === 'confirm') {
            this.widgetApi.updateProperty(widgetId, { image: r.image }).subscribe();
          }
        });
        break;
      case 'gradient':
        console.log('GRADIENT',data.data.background);
        this.blockApi.updateProperty(block.id, { background: data.data.background }).subscribe();
        break;
    }
  }

}
