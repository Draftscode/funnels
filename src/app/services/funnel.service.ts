import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { IFunnel } from "../model/funnel.interface";
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
}
