import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { concat, Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { IWidget } from "../model/widget.interface";
import { IBlock } from "../shared/components/editor/block.interface";
import { CreateDialogComponent } from "../shared/components/editor/create-dialog/create-dialog.component";
import { BlockService } from "./block.service";
import { FunnelService } from "./funnel.service";
import { WidgetService } from "./widget.service";

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  constructor(
    private dialog: MatDialog,
    private blockApi: BlockService,
    private widgetApi: WidgetService,
    private funnelApi: FunnelService,
  ) { }

  createWidget(block: IBlock): Observable<IWidget | null> {
    return this.dialog.open(CreateDialogComponent, {
      data: { block, }, panelClass: 'lightbox'
    }).afterClosed().pipe(switchMap((r) => {
      if (!r) { return of(null); }
      const widgetIds: string[] = (block.widgetIds || []).concat(r.widget.id);


      return this.blockApi.updateProperty(block.id, { widgetIds }).pipe(switchMap(() => {
        return this.widgetApi.create(r.widget.id, r.widget);
      }));

    }));
  }

  deleteFunnel(funnelId: string): void {
    this.funnelApi.deleteItem(funnelId).subscribe();
  }
}
