import { state } from "@angular/animations";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { IBlock } from "../../components/editor/block.interface";
import { AddWidgetsToBlock, CreateBlock, GetAllBlocks, UpdateBlockProperties } from "./block.actions";

export const BLOCK_STORAGE_NAME = 'block';

export interface IBlockStateModel {
  ids: string[];
  entities: Record<string, IBlock>;
}

@State<IBlockStateModel>({
  name: BLOCK_STORAGE_NAME,
  defaults: {
    ids: [],
    entities: {},
  },
})
@Injectable()
export class BlockState {
  constructor(private http: HttpClient) {
  }

  @Action(GetAllBlocks)
  getAllFunnels({ patchState }: StateContext<IBlockStateModel>) {
    return this.load().pipe(tap((f: IBlock[]) => {
      const entities: Record<string, IBlock> = {};

      f.forEach((f: IBlock) => {
        entities[f.id] = f;
      });

      patchState({
        ids: [...f.map((f: IBlock) => f.id)],
        entities,
      });
    }));
  }

  @Selector()
  static getItemsByIdFn(state: IBlockStateModel) {
    return (ids: string[]) => {
      return ids.map((id: string) => state.entities[id]);
    };
  }

  @Action(UpdateBlockProperties)
  updatePageProperty({ patchState, getState }: StateContext<IBlockStateModel>, { blockId, type, changes }: UpdateBlockProperties) {
    const state = getState();
    const entities = {
      ...state.entities,
    };
    if (type === 'add') {
      Object.keys(changes).forEach((key: string) => {
        (entities[blockId]as any)[key] += changes[key];
      });
    } else {
      entities[blockId] = Object.assign(entities[blockId], changes);
    }

    return this.store(Object.keys(entities).map((key: string) => entities[key])).pipe(tap(() => {
      patchState({ entities });
    }));
  }

  @Action(AddWidgetsToBlock)
  addBlocksToPage({ patchState, getState }: StateContext<IBlockStateModel>, { blockId, widgets }: AddWidgetsToBlock) {
    const state = getState();
    const entities = {
      ...state.entities,
    };

    entities[blockId].widgetIds = (entities[blockId].widgetIds || []).concat(widgets);
    return this.store(Object.keys(entities).map((key: string) => entities[key])).pipe(tap(() => {
      patchState({ entities });
    }));
  }

  @Action(CreateBlock)
  createBlock({ patchState, getState }: StateContext<IBlockStateModel>, { payload }: CreateBlock) {
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

  /**
   * stores data locally
   * @param {IBlock[]} blocks blocks to store
   * @returns Observable<IBlock[]>
   */
  private store(blocks: IBlock[]): Observable<IBlock[]> {
    const s: string = JSON.stringify(blocks);
    localStorage.setItem(BLOCK_STORAGE_NAME, s);
    return of(blocks);
  }

  /**
   * load all blocks
   * @returns Observable<IBlock[]>
   */
  private load(): Observable<IBlock[]> {
    const itemString: string | null = localStorage.getItem(BLOCK_STORAGE_NAME);
    if (!itemString) { return of([]) };

    const items: IBlock[] = JSON.parse(itemString);
    return of(items);
  }
}
