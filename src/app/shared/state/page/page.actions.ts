import { IPage } from "../../components/page/page.interface";

export enum EPageActions {
  CREATE_PAGE = '[page] create page',
  GET_ALL_PAGES = '[page] get all pages',
  GET_PAGES_BY_ID = '[page] get pages by id',
  UPDATE_PROPERTY = '[page] update property',
  ADD_BLOCKS = '[page] add blocks',
}

export class CreatePage {
  static readonly type: EPageActions = EPageActions.CREATE_PAGE;

  constructor(public payload: IPage) { }
}

export class GetAllPages {
  static readonly type: EPageActions = EPageActions.GET_ALL_PAGES;

  constructor() { }
}

export class GetPagesById {
  static readonly type: EPageActions = EPageActions.GET_PAGES_BY_ID;

  constructor(public payload: string[]) { }
}


export class UpdatePageProperty {
  static readonly type: EPageActions = EPageActions.UPDATE_PROPERTY;

  constructor(public blockId: string, public changes: Record<string, any>) { }
}

export class AddBlocksToPage {
  static readonly type: EPageActions = EPageActions.ADD_BLOCKS;
  constructor(public pageId: string, public blocks: string[]) { }
}



