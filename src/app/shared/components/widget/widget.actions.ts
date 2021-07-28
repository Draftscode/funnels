import { Action } from "@ngrx/store";
import { IWidget } from "src/app/model/widget.interface";

export enum EWidgetActionType {
  CREATE = '[Widget] Create',
  UPDATE = '[Widget] Update',
  DELETE = '[Widget] Delete',
}

export class Create implements Action {
  readonly type = EWidgetActionType.CREATE;

  constructor(public widget: IWidget) { }
}

export class Update implements Action {
  readonly type = EWidgetActionType.UPDATE;

  constructor(public id: string, public changes: IWidget) { }
}

export class Delete implements Action {
  readonly type = EWidgetActionType.DELETE;

  constructor(public id: string) { }
}

export type WidgetActions = Create | Update | Delete;
