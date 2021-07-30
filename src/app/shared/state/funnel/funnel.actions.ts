import { IFunnel } from "src/app/model/funnel.interface";

export enum EFunnelActions {
  CREATE_FUNNEL = '[funnel] create',
  GET_ALL_FUNNELS = '[funnel] get all funnels',
  UPDATE_FUNNEL = '[funnel] update funnel',
  ADD_PAGE_TO_FUNNEL = '[funnel] add page',
}

export class CreateFunnel {
  static readonly type: EFunnelActions = EFunnelActions.CREATE_FUNNEL;

  constructor(public payload: IFunnel) { }
}

export class GetAllFunnels {
  static readonly type: EFunnelActions = EFunnelActions.GET_ALL_FUNNELS;

  constructor() { }
}

export class UpdateFunnel {
  static readonly type: EFunnelActions = EFunnelActions.UPDATE_FUNNEL;

  constructor(public funnelId: string, public changes: Record<string, any>) { }
}

export class AddPagesToFunnel {
  static readonly type: EFunnelActions = EFunnelActions.ADD_PAGE_TO_FUNNEL;

  constructor(public funnelId: string, public pageId: string) { }
}
