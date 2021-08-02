import { Injectable } from "@angular/core";
import { IWidget } from "../model/widget.interface";
import { ModelService } from "./model.service";

@Injectable({
  providedIn: 'root',
})
export class WidgetService extends ModelService<IWidget> {
  constructor() {
    super();
    this.STORAGE_NAME = 'widgets';
    this.load().subscribe((f: Record<string, IWidget>) => { this.updateItems(f).subscribe(); });
  }
}
