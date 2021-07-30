import { IBlock } from "../../components/editor/block.interface";

export enum EWidgetActions {
  CREATE_WIDGET = '[widget] create',
  GET_ALL_WIDEGTS = '[widget] get all',
}

export class CreateWidget {
  static readonly type: EWidgetActions = EWidgetActions.CREATE_WIDGET;

  constructor(public payload: IBlock) { }
}

export class GetAllWidgets {
  static readonly type: EWidgetActions = EWidgetActions.GET_ALL_WIDEGTS;

  constructor() { }
}

