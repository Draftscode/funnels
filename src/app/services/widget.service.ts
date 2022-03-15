import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { EWidgetType } from "../model/widget-type.enum";
import { IWidget, TWidgetType } from "../model/widget.interface";
import { GlobalUtils } from "../utils/global.utils";
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

  public createWidget(text: string = 'Neuer Text', index: number = 0): IWidget {
    const w: IWidget = {
      id: GlobalUtils.uuidv4(),
      type: EWidgetType.SUBSRIPTION_FORM,
      text: text,
      index: index,
      backgroundOpacity: 1,
      imageOpacity: 1,
      fontFamily: 'arial',
    };

    return w;
  }


  /**
   * deletes a single widget
   * @param {string} widgetId id of the widget
   * @returns Observable<Record<string, any> | undefined>
   */
  public deleteWidget(widgetId: string): Observable<Record<string, any> | undefined> {
    const widget: IWidget = this.items.getValue()[widgetId];
    if (!widget) { return of(undefined); }

    return this.deleteItem(widgetId);
  }

  public copy(widgetId: string): Observable<TWidgetType> {
    const widget: TWidgetType = this.items.getValue()[widgetId];
    const copy: TWidgetType = Object.assign({}, widget);
    copy.id = GlobalUtils.uuidv4();
    return this.create(copy.id, copy);
  }
}
