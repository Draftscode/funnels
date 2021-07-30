import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { IPage } from "../../components/page/page.interface";
import { AddBlocksToPage, CreatePage, GetAllPages, UpdatePageProperty } from "./page.actions";

export const PAGE_STORAGE_NAME = 'page';

export interface IPageStateModel {
  ids: string[];
  entities: Record<string, IPage>;
}

@State<IPageStateModel>({
  name: PAGE_STORAGE_NAME,
  defaults: {
    ids: [],
    entities: {},
  },
})
@Injectable()
export class PageState {

  constructor(
    private http: HttpClient,
    private store: Store,
  ) { }

  @Selector()
  static getItemByIdFn(state: IPageStateModel) {
    return (...ids: string[]) => {
      return ids.map((id: string) => state.entities[id]);
    };
  }

  @Action(AddBlocksToPage)
  addBlocksToPage({ patchState, getState }: StateContext<IPageStateModel>, { pageId, blocks }: AddBlocksToPage) {
    const state = getState();
    const entities = {
      ...state.entities,
    };

    entities[pageId].blockIds = (entities[pageId].blockIds || []).concat(blocks);
    return this.save(Object.keys(entities).map((key: string) => entities[key])).pipe(tap(() => {
      patchState({ entities });
    }));
  }

  @Action(UpdatePageProperty)
  updatePageProperty({ patchState, getState }: StateContext<IPageStateModel>, { blockId, changes }: UpdatePageProperty) {
    const state = getState();
    const entities = {
      ...state.entities,
    };
    entities[blockId] = Object.assign(entities[blockId], changes);

    return this.save(Object.keys(entities).map((key: string) => entities[key])).pipe(tap(() => {
      patchState({ entities });
    }));
  }

  @Action(CreatePage)
  createPage({ patchState, getState }: StateContext<IPageStateModel>, { payload }: CreatePage) {
    const state = getState();
    const entities: Record<string, IPage> = {
      ...state.entities,
      [payload.id]: payload,
    };

    return this.save(Object.keys(entities).map((key: string) => entities[key])).pipe(tap(() => {
      patchState({
        ids: [...state.ids, payload.id],
        entities,
      });
    }));
  }

  @Action(GetAllPages)
  getAllPages({ patchState, getState }: StateContext<IPageStateModel>) {
    return this.load().pipe(tap((f: IPage[]) => {
      const entities: Record<string, IPage> = {};

      f.forEach((f: IPage) => {
        entities[f.id] = f;
      });

      patchState({
        ids: [...f.map((f: IPage) => f.id)],
        entities,
      });
    }));
  }

  /**
   * stores data locally
   * @param {IPage[]} pages pages to store
   * @returns Observable<IPage[]>
   */
  private save(pages: IPage[]): Observable<IPage[]> {
    const s: string = JSON.stringify(pages);
    localStorage.setItem(PAGE_STORAGE_NAME, s);
    return of(pages);
  }

  /**
   * load all pages
   * @returns Observable<IPage[]>
   */
  private load(): Observable<IPage[]> {
    const itemString: string | null = localStorage.getItem(PAGE_STORAGE_NAME);
    if (!itemString) { return of([]) };

    const items: IPage[] = JSON.parse(itemString);
    return of(items);
  }
}
