import { Injectable } from "@angular/core";
import { IBlock } from "../shared/components/editor/block.interface";
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
}
