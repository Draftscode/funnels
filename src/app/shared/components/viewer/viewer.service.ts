import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { IFunnel } from "src/app/model/funnel.interface";
import { FunnelService } from "src/app/services/funnel.service";

const STORAGE_NAME = 'saved-funnels';

@Injectable({
  providedIn: 'root',
})
export class ViewerService {

  constructor(private funnelApi: FunnelService) { }

  public loadResponseForFunnel(funnelId: string): Observable<Record<string, any>[]> {
    const data: Record<string, Record<string, any>[]> = this.load() || {};
    return of(data[funnelId]);
  }

  private load(): Record<string, Record<string, any>[]> | undefined {
    const s: string | null = localStorage.getItem(STORAGE_NAME);
    if (!s) { return undefined; }
    const r: Record<string, any> = JSON.parse(s);
    return r;
  }

  public save(funnelId: string, record: Record<string, any>): Observable<Record<string, IFunnel>> {
    record.unchecked = true;
    record.created = new Date();
    const data: Record<string, Record<string, any>[]> = this.load() || {};
    const responseList: Record<string, any>[] = data[funnelId] || [];
    responseList.push(record);
    data[funnelId] = responseList;

    const totalResponses: number = responseList.length;
    const uncheckedResponses: number = responseList.filter((r: Record<string, any>) => r.unchecked).length;

    localStorage.setItem(STORAGE_NAME, JSON.stringify(data));
    return this.funnelApi.updateProperty(funnelId, { totalResponses, uncheckedResponses });
  }
}
