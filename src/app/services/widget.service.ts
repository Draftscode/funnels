import { Injectable } from "@angular/core";
import { TWidgetType } from "../model/widget.interface";
import { ModelService } from "./model.service";

@Injectable({
  providedIn: 'root',
})
export class WidgetService extends ModelService<TWidgetType> {
  constructor() {
    super();
    this.STORAGE_NAME = 'widgets';
    this.load().subscribe((f: Record<string, TWidgetType>) => { this.updateItems(f).subscribe(); });
  }
}
