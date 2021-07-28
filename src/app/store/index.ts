import { ActionReducerMap } from "@ngrx/store";
import { blockReducer } from "src/app/shared/components/block/block.reducer";
import { pageReducer } from "src/app/shared/components/page/page.reducer";
import { funnelReducer } from "../shared/components/funnel/funnel.reducer";
import { widgetReducer } from "../shared/components/widget/widget.reducer";

export const reducers: ActionReducerMap<any, any> = {
  page: pageReducer,
  block: blockReducer,
  widget: widgetReducer,
  funnel: funnelReducer,
};
