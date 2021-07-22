import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IBlock } from "src/app/shared/components/editor/block.interface";
import * as actions from './block.actions';

export const blockAdapter = createEntityAdapter<IBlock>();
export interface BlockState extends EntityState<IBlock> { };

const defaultPage = {
    ids: [],
    entities: {
    }
}

export const initialState: BlockState = blockAdapter.getInitialState(defaultPage);

export function blockReducer(
    state: BlockState = initialState,
    action: actions.PageActions): BlockState {
    switch (action.type) {
        case actions.EBlockActionType.CREATE:
            return blockAdapter.addOne(action.block, state);
        case actions.EBlockActionType.UPDATE:
            return blockAdapter.updateOne({
                id: action.id,
                changes: action.changes,
            }, state);

        case actions.EBlockActionType.DELETE:
            return blockAdapter.removeOne(action.id, state);

        default:
            return state;

    }
}

export const getPageState = createFeatureSelector<BlockState>('block');

export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = blockAdapter.getSelectors(getPageState);

export const getItemById = (id: string) => createSelector(selectAll, (allItems: IBlock[]): IBlock | null => {
    if (allItems) {
        return allItems.find(item => {
            return item.id === id;
        }) || null;
    } else {
        return null;
    }
});


export const hasActivatedBlock = () => createSelector(selectAll, (allItems: IBlock[]): boolean => {
    return allItems?.find(item => {
        return item.activated;
    }) ? true : false;
});
