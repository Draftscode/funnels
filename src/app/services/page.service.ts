import { Injectable } from "@angular/core";
import { IPage } from "../shared/components/page/page.interface";
import { GlobalUtils } from "../utils/global.utils";
import { ModelService } from "./model.service";

@Injectable({
  providedIn: 'root',
})
export class PageService extends ModelService<IPage>{
  constructor() {
    super();
    this.STORAGE_NAME = 'pages';
    this.load().subscribe((f: Record<string, IPage>) => { this.updateItems(f).subscribe(); });
  }

  /**
   * creates a new page with predefined settings
   * @param {string[]} blockIds list of block ids
   * @returns IBlock
   */
  public createPage(blockIds: string[]): IPage {
    const page: IPage = {
      id: GlobalUtils.uuidv4(),
      index: 0,
      name: 'Neue Seite',
      blockIds,
    };
    return page;
  }
}
