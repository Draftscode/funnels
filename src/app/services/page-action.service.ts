import { ComponentRef, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { IWidget } from "../model/widget.interface";
import { IBlock } from "../shared/components/editor/block.interface";
import { CreateDialogComponent } from "../shared/components/editor/create-dialog/create-dialog.component";
import { CtxComponent } from "../shared/components/editor/ctx/ctx.component";
import { EditDialogComponent } from "../shared/components/editor/edit-dialog/edit-dialog.component";
import { FunnelService } from "./funnel.service";
import { OverlayService } from "./overlay.service";

@Injectable({
  providedIn: 'root',
})
export class PageActionService {
  private ctx: ComponentRef<CtxComponent> | undefined;

  constructor(
    private funnelApi: FunnelService,
    private overlayApi: OverlayService,
    private dialog: MatDialog
  ) { }

  closeCtx(): void {
    if (!this.ctx) { return; }
    this.ctx.instance.close();
  }

  createWidget(funnelId: string, pageId: string, blockId: string): void {
    // this.dialog.open(CreateDialogComponent, {
    //   data: {
    //     block: this.funnelApi.getBlock(funnelId, pageId, blockId),
    //   }, panelClass: 'lightbox'
    // }).afterClosed().subscribe((r) => {
    //   if (!r) { return; }
    //   this.funnelApi.addWidget(funnelId, pageId, blockId, r.widget);
    // });
  }


  editWidget(funnelId: string, pageId: string, blockId: string): void {
    // this.dialog.open(EditDialogComponent, {
    //   data: {
    //     widget: this.funnelApi.getActivatedWidget(funnelId, pageId, blockId)!
    //   },
    //   panelClass: 'lightbox',
    // }).afterClosed().subscribe((r) => {
    //   if (!r) { return; }
    //   this.funnelApi.updateWidget(funnelId, pageId, blockId, r);
    // });
  }

  openEditor(el: HTMLElement, funnelId: string, pageId: string, blockId: string): void {

  }
}
