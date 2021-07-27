import { ComponentRef, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { IWidget } from "../model/widget.interface";
import { IBlock } from "../shared/components/editor/block.interface";
import { CreateDialogComponent } from "../shared/components/editor/create-dialog/create-dialog.component";
import { CtxComponent, IAction } from "../shared/components/editor/ctx/ctx.component";
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
    this.dialog.open(CreateDialogComponent, { data: {} }).afterClosed().subscribe((r) => {
      if (!r) { return; }
      this.funnelApi.addWidget(funnelId, pageId, blockId, r.widget);
    });
  }


  editWidget(funnelId: string, pageId: string, blockId: string): void {


    this.dialog.open(EditDialogComponent, {
      data: {
        widget: this.funnelApi.getActivatedWidget(funnelId, pageId, blockId)!
      }
    }).afterClosed().subscribe((r) => {
      if (!r) { return; }
      this.funnelApi.addWidget(funnelId, pageId, blockId, r.widgets);
    });
  }

  openEditor(el: HTMLElement, funnelId: string, pageId: string, blockId: string): void {
    if (this.ctx) { this.ctx.instance.close(); }
    const b: IBlock | undefined = this.funnelApi.getBlock(funnelId, pageId, blockId);
    this.ctx = this.overlayApi.create(CtxComponent, el, {
      actions: [{
        name: 'Erstellen',
        icon: 'add',
        id: 'addBlock',
      }, {
        name: 'Editieren',
        icon: 'edit',
        id: 'editBlock',
      }, {
        name: 'Löschen',
        icon: 'delete',
        id: 'deleteBlock',
      }],
    }, {
      overlayOrigin: 'right',
      backdrop: false,
      postion: {
        right: 'end'
      }
    }).componentRef;

    this.ctx.instance.beforeAction.subscribe((a: IAction) => {
      switch (a.id) {
        case 'deleteBlock':
          this.funnelApi.deleteWidgetOrBlock(funnelId, pageId, blockId);
          break;
        case 'addBlock':
          this.createWidget(funnelId, pageId, blockId);
          break;
        case 'editBlock':
          this.editWidget(funnelId, pageId, blockId);
          break;
      }
    });
  }
}
