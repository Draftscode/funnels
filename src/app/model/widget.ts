import { EWidgetType } from "./widget-type.enum";

export interface IWidget {
  id: string;
  type?: EWidgetType;
  text?: string;
  editable?: boolean;
}
