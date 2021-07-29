import { Action } from "@ngrx/store";
import { IFunnel } from "src/app/model/funnel.interface";

export enum EFunnelActionType {
  CREATE = '[Funnel] Create',
  UPDATE = '[Funnel] Update',
  DELETE = '[Funnel] Delete',
}

export class Create implements Action {
  readonly type = EFunnelActionType.CREATE;

  constructor(public funnel: IFunnel) { }
}

export class Update implements Action {
  readonly type = EFunnelActionType.UPDATE;

  constructor(public id: string, public changes: Record<string,any>) { }
}

export class Delete implements Action {
  readonly type = EFunnelActionType.DELETE;

  constructor(public id: string) { }
}

export type FunnelActions = Create | Update | Delete;
