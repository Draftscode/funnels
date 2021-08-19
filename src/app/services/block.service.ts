import { Injectable } from "@angular/core";
import { forkJoin, Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { IBlock } from "../shared/components/editor/block.interface";
import { GlobalUtils } from "../utils/global.utils";
import { ModelService } from "./model.service";
import { WidgetService } from "./widget.service";

@Injectable({
  providedIn: 'root',
})
export class BlockService extends ModelService<IBlock>{
  constructor(private widgetApi: WidgetService) {
    super();
    this.STORAGE_NAME = 'blocks';
    this.load().subscribe((f: Record<string, IBlock>) => { this.updateItems(f).subscribe(); });
  }

  /**
   * creates a new block with predefined settings
   * @returns IBlock
   */
  public createBlock(): Observable<IBlock> {
    const block: IBlock = {
      id: GlobalUtils.uuidv4(),
      height: 300,
      index: 0,
      backgroundOpacity: 1,
      background: 'white',
      imageOpacity: 1,
    };

    return this.create(block.id, block);
  }

  /**
   * deletes a single block
   * @param {string} blockId id of the block
   * @returns Observable<Record<string, any> | undefined>
   */
  public deleteBlock(blockId: string): Observable<Record<string, any> | undefined> {
    const block: IBlock = this.items.getValue()[blockId];
    if (!block) { return of(undefined); }

    console.log('BLOCK', block);
    if ((block.widgetIds?.length || 0) > 0) {
      return forkJoin((block.widgetIds || []).map((widgetId: string) =>
        this.widgetApi.deleteWidget(widgetId))).pipe(switchMap(() => this.deleteItem(blockId)));
    }
    return this.deleteItem(blockId);
  }
}
