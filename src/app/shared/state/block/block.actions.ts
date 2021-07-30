import { IBlock } from "../../components/editor/block.interface";

export enum EBlockActions {
  CREATE_BLOCK = '[block] create',
  GET_ALL_BLOCKS = '[block] get all',
  UPDATE_BLOCK_PROPERTIES = '[block] update properties',
  ADD_WIDGETS_TO_BLOCK = '[block] add widgets ',
}

export class CreateBlock {
  static readonly type: EBlockActions = EBlockActions.CREATE_BLOCK;

  constructor(public payload: IBlock) { }
}

export class GetAllBlocks {
  static readonly type: EBlockActions = EBlockActions.GET_ALL_BLOCKS;

  constructor() { }
}

export class AddWidgetsToBlock {
  static readonly type: EBlockActions = EBlockActions.ADD_WIDGETS_TO_BLOCK;
  constructor(public blockId: string, public widgets: string[]) { }
}

export class UpdateBlockProperties {
  static readonly type: EBlockActions = EBlockActions.UPDATE_BLOCK_PROPERTIES;
  constructor(public blockId: string, public type: 'add', public changes: Record<string, any>) { }
}
