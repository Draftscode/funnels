import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IFunnel } from "src/app/model/funnel.interface";
import { IPage } from "../page/page.interface";
import * as actions from './funnel.actions';
import { EFunnelActionType } from "./funnel.actions";

export const funnelAdapter = createEntityAdapter<IFunnel>();
export interface FunnelState extends EntityState<IFunnel> { };

const defaultFunnel = {
  ids: [],
  entities: {
  }
}

export const initialState: FunnelState = funnelAdapter.getInitialState(defaultFunnel);

export function funnelReducer(
  state: FunnelState = initialState,
  action: actions.FunnelActions): FunnelState {
    funnelAdapter.mapOne
  switch (action.type) {
    case EFunnelActionType.CREATE:
      return funnelAdapter.addOne(action.funnel, state);
    case EFunnelActionType.UPDATE:
      return funnelAdapter.updateOne({
        id: action.id,
        changes: action.changes,
      }, state);
    case EFunnelActionType.DELETE:
      return funnelAdapter.removeOne(action.id, state);

    default:
      return state;

  }
}

export const getFunnelState = createFeatureSelector<FunnelState>('funnel');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = funnelAdapter.getSelectors(getFunnelState);


export const selectAllPagesFromFunnel = (funnelId: string) => createSelector(selectEntities, (allItems) => {
  if (allItems) {
    const f: IFunnel | undefined = allItems[funnelId];
    if (!f) { return []; }
    return Object.keys(f.pages || {})
      .map((pKey: string) => f.pages[pKey])
      .sort((p1: IPage, p2: IPage) => p1.index < p2.index ? -1 : 1);
  } else {
    return [];
  }
});

export const selectItemById = (id: string) => createSelector(selectEntities, (allItems) => {
  if (allItems) {
    console.log(allItems);
    return allItems[id];
  } else {
    return null;
  }
});
