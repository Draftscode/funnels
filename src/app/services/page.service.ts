import { Injectable } from "@angular/core";
import { forkJoin, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { IBlock } from "../shared/components/editor/block.interface";
import { IPage } from "../shared/components/page/page.interface";
import { GlobalUtils } from "../utils/global.utils";
import { BlockService } from "./block.service";
import { ModelService } from "./model.service";


export interface CreatePageOptions {
  numberOfBlocks?: number;
  index?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PageService extends ModelService<IPage>{
  constructor(private blockApi: BlockService) {
    super();
    this.STORAGE_NAME = 'pages';
    this.load().subscribe((f: Record<string, IPage>) => { this.updateItems(f).subscribe(); });
  }

  /**
   * creates a new page with predefined settings
   * @param {string[]} blockIds list of block ids
   * @returns IBlock
   */
  public createPage(options?: CreatePageOptions): Observable<IPage> {
    const page: IPage = {
      id: GlobalUtils.uuidv4(),
      index: options?.index || 0,
      name: 'Neue Seite',
      blockIds: [],
    };
    return this.blockApi.createBlock().pipe(switchMap((block: IBlock) => {
      page.blockIds = [block.id];
      return this.create(page.id, page);
    })).pipe(map(() => page));
  }

  /**
   * deletes a single page
   * @param {string} pageId id of the page
   * @returns Observable<Record<string, any> | undefined>
   */
  public deletePage(pageId: string): Observable<Record<string, any> | undefined> {
    const page: IPage = this.items.getValue()[pageId];
    if (!page) { return of(undefined); }

    console.log('delete page', page);
    if ((page.blockIds?.length || 0) > 0) {
      return forkJoin((page.blockIds || []).map((blockId: string) =>
        this.blockApi.deleteBlock(blockId))).pipe(switchMap(() => this.deleteItem(pageId)));
    }
    return this.deleteItem(pageId);
  }
}
