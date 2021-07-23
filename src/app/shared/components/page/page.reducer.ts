import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createFeatureSelector } from "@ngrx/store";
import * as actions from './page.actions';
import { EPageActionType } from "./page.actions";
import { IPage } from "./page.interface";

export const pageAdapter = createEntityAdapter<IPage>();
export interface PageState extends EntityState<IPage> { };

const defaultPage = {
    ids: [],
    entities: {
    }
}

export const initialState: PageState = pageAdapter.getInitialState(defaultPage);

export function pageReducer(
    state: PageState = initialState,
    action: actions.PageActions): PageState {
    switch (action.type) {
        case EPageActionType.CREATE:
            return pageAdapter.addOne(action.page, state);
        case EPageActionType.UPDATE:
            return pageAdapter.updateOne({
                id: action.id,
                changes: action.changes,
            }, state);
        case EPageActionType.DELETE:
            return pageAdapter.removeOne(action.id, state);

        default:
            return state;

    }
}

export const getPageState = createFeatureSelector<PageState>('page');

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = pageAdapter.getSelectors(getPageState);
