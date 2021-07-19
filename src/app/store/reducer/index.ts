import { ActionReducerMap } from "@ngrx/store";
import { blockReducer } from "src/app/components/block/block.reducer";
import { pageReducer } from "src/app/components/page/page.reducer";

export const reducers: ActionReducerMap<any, any> = {
    page: pageReducer,
    block: blockReducer,
};