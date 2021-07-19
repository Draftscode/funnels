import { Action } from "@ngrx/store";
import { IBlock } from "src/app/editor/block";

export enum EBlockActionType {
    CREATE = '[Blocks] Create',
    UPDATE = '[Blocks] Update',
    DELETE = '[Blocks] Delete',
}

export class Create implements Action {
    readonly type = EBlockActionType.CREATE;

    constructor(public block: IBlock) { }
}

export class Update implements Action {
    readonly type = EBlockActionType.UPDATE;

    constructor(public id: string, public changes: Record<string,any>) { }
}

export class Delete implements Action {
    readonly type = EBlockActionType.DELETE;

    constructor(public id: string) { }
}

export type PageActions = Create | Update | Delete;
