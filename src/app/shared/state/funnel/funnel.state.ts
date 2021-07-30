import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { IFunnel } from "src/app/model/funnel.interface";
import { AddPagesToFunnel, CreateFunnel, GetAllFunnels, UpdateFunnel } from "./funnel.actions";

export const FUNNEL_STORAGE_NAME = 'funnel';

export interface IFunnelStateModel {
  ids: string[];
  entities: Record<string, IFunnel>;
}

@State<IFunnelStateModel>({
  name: 'funnel',
  defaults: {
    ids: [],
    entities: {},
  },
})
@Injectable()
export class FunnelState {

  constructor(private http: HttpClient) { }

  @Selector()
  static getItemsByIdFn(state: IFunnelStateModel): () => IFunnel[] {
    return (...ids: string[]) => {
      return ids.map((id: string) => state.entities[id]);
    };
  }

  @Selector()
  static getItemByIdFn(state: IFunnelStateModel) {
    return (id: string) => {
      return state.entities[id];
    };
  }

  @Action(CreateFunnel)
  createFunnel({ patchState, getState }: StateContext<IFunnelStateModel>, { payload }: CreateFunnel) {
    const state = getState();
    const entities = {
      ...state.entities,
      [payload.id]: payload,
    };

    return this.store(Object.keys(entities).map((key: string) => entities[key])).pipe(tap(() => {
      patchState({
        ids: [...state.ids, payload.id],
        entities,
      });
    }));
  }

  @Action(UpdateFunnel)
  updatePageProperty({ patchState, getState }: StateContext<IFunnelStateModel>, { funnelId, changes }: UpdateFunnel) {
    const state = getState();
    const entities = {
      ...state.entities,
    };
    entities[funnelId] = Object.assign(entities[funnelId], changes);

    return this.store(Object.keys(entities).map((key: string) => entities[key])).pipe(tap(() => {
      patchState({ entities });
    }));
  }

  @Action(GetAllFunnels)
  getAllFunnels({ patchState }: StateContext<IFunnelStateModel>) {
    return this.load().pipe(tap((f: IFunnel[]) => {
      const entities: Record<string, IFunnel> = {};

      f.forEach((f: IFunnel) => {
        entities[f.id] = f;
      });

      patchState({
        ids: [...f.map((f: IFunnel) => f.id)],
        entities,
      });
    }));
  }

  @Action(AddPagesToFunnel)
  addPageToFunnel({ patchState, getState }: StateContext<IFunnelStateModel>, { funnelId, pageId }: AddPagesToFunnel) {
    const state = getState();
    const entities = {
      ...state.entities,
    };
    entities[funnelId].pageIds?.push(pageId);
    return this.store(Object.keys(entities).map((key: string) => entities[key])).pipe(tap(() => {
      patchState({ entities });
    }));
  }

  /**
   * stores data locally
   * @param {IFunnel[]} funnels funnels to store
   * @returns Observable<IFunnel[]>
   */
  private store(funnels: IFunnel[]): Observable<IFunnel[]> {
    const s: string = JSON.stringify(funnels);
    localStorage.setItem(FUNNEL_STORAGE_NAME, s);
    return of(funnels);
  }

  /**
   * load all funnels
   * @returns Observable<IFunnel[]>
   */
  private load(): Observable<IFunnel[]> {
    const itemString: string | null = localStorage.getItem(FUNNEL_STORAGE_NAME);
    if (!itemString) { return of([]) };

    const items: IFunnel[] = JSON.parse(itemString);
    return of(items);
  }
}
