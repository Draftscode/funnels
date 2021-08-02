import { Injectable } from "@angular/core";
import { IPage } from "../shared/components/page/page.interface";
import { ModelService } from "./model.service";

@Injectable({
  providedIn: 'root',
})
export class PageService extends ModelService<IPage>{
  constructor() {
    super();
    this.STORAGE_NAME = 'pages';
    this.load().subscribe((f: Record<string, IPage>) => { this.updateItems(f).subscribe(); });
  }
}
