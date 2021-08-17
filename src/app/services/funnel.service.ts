import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { IFunnel } from "../model/funnel.interface";
import { GlobalUtils } from "../utils/global.utils";
import { ModelService } from "./model.service";

@Injectable({
  providedIn: 'root',
})
export class FunnelService extends ModelService<IFunnel>{
  constructor() {
    super();
    this.STORAGE_NAME = 'funnels';
    this.load().subscribe((f: Record<string, IFunnel>) => { this.updateItems(f).subscribe(); });
  }

  /**
  * creates a new funnel with predefined settings
  * @param {string[]} pageIds list of page ids
  * @returns IFunnel
  */
  public createFunnel(pageIds: string[]): IFunnel {
    const funnel: IFunnel = {
      id: GlobalUtils.uuidv4(),
      name: 'Neuer Funnel',
      websites: {},
      pageIds,
    };
    return funnel;
  }
}
