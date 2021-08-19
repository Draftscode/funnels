import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { IFunnel } from "src/app/model/funnel.interface";
import { FunnelService } from "src/app/services/funnel.service";

export interface DataStorage {
  unchecked: boolean;
  created: Date;
  record: Record<string, any>;
}

const STORAGE_NAME = 'saved-funnels';

@Injectable({
  providedIn: 'root',
})
export class ViewerService {

  constructor(private funnelApi: FunnelService) { }

  public loadResponseForFunnel(funnelId: string): Observable<DataStorage[]> {
    const data: Record<string, DataStorage[]> = this.load() || {};
    return of(data[funnelId]);
  }

  private load(): Record<string, DataStorage[]> | undefined {
    const s: string | null = localStorage.getItem(STORAGE_NAME);
    if (!s) { return undefined; }
    const r: Record<string, DataStorage[]> = JSON.parse(s);
    return r;
  }

  public save(funnelId: string, record: Record<string, any>): Observable<Record<string, IFunnel>> {
    const d: DataStorage = {
      unchecked: true,
      created: new Date(),
      record,
    }

    const data: Record<string, DataStorage[]> = this.load() || {};
    const responseList: DataStorage[] = data[funnelId] || [];
    responseList.push(d);
    data[funnelId] = responseList;

    const totalResponses: number = responseList.length;
    const uncheckedResponses: number = responseList.filter((r: Record<string, any>) => r.unchecked).length;

    localStorage.setItem(STORAGE_NAME, JSON.stringify(data));
    return this.funnelApi.updateProperty(funnelId, { totalResponses, uncheckedResponses });
  }
}
