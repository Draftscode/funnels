import { Injectable } from "@angular/core";
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
}
