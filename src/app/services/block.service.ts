import { Injectable } from "@angular/core";
import { IBlock } from "../shared/components/editor/block.interface";
import { GlobalUtils } from "../utils/global.utils";
import { ModelService } from "./model.service";

@Injectable({
  providedIn: 'root',
})
export class BlockService extends ModelService<IBlock>{
  constructor() {
    super();
    this.STORAGE_NAME = 'blocks';
    this.load().subscribe((f: Record<string, IBlock>) => { this.updateItems(f).subscribe(); });
  }

  /**
   * creates a new block with predefined settings
   * @returns IBlock
   */
  public createBlock(): IBlock {
    const block: IBlock = {
      id: GlobalUtils.uuidv4(),
      height: 300,
      index: 0,
      widgets: {},
      backgroundOpacity: 1,
      background: 'white',
      imageOpacity: 1,
    };
    return block;
  }
}
