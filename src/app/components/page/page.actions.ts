import { Action } from "@ngrx/store";
import { IPage } from "./page.interface";

export enum EPageActionType {
    CREATE = '[Pages] Create',
    UPDATE = '[Pages] Update',
    DELETE = '[Pages] Delete',
}

export class Create implements Action {
    readonly type = EPageActionType.CREATE;

    constructor(public page: IPage) { }
}

export class Update implements Action {
    readonly type = EPageActionType.UPDATE;

    constructor(public id: string, public changes: IPage) { }
}

export class Delete implements Action {
    readonly type = EPageActionType.DELETE;

    constructor(public id: string) { }
}

export type PageActions = Create | Update | Delete;
