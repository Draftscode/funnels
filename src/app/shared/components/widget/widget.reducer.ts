import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createFeatureSelector } from "@ngrx/store";
import { IWidget } from "src/app/model/widget.interface";
import * as actions from './widget.actions';
import { EWidgetActionType } from "./widget.actions";

export const widgetAdapter = createEntityAdapter<IWidget>();
export interface WidgetState extends EntityState<IWidget> { };

const defaultWidget = {
  ids: [],
  entities: {
  }
}

export const initialState: WidgetState = widgetAdapter.getInitialState(defaultWidget);

export function widgetReducer(
  state: WidgetState = initialState,
  action: actions.WidgetActions): WidgetState {
  switch (action.type) {
    case EWidgetActionType.CREATE:
      return widgetAdapter.addOne(action.widget, state);
    case EWidgetActionType.UPDATE:
      return widgetAdapter.updateOne({
        id: action.id,
        changes: action.changes,
      }, state);
    case EWidgetActionType.DELETE:
      return widgetAdapter.removeOne(action.id, state);

    default:
      return state;

  }
}

export const getWidgetState = createFeatureSelector<WidgetState>('widget');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = widgetAdapter.getSelectors(getWidgetState);
