import { EWidgetType } from "./widget-type.enum";

export interface IWidget {
  id: string;
  type?: EWidgetType;
  text?: string;
  activated?: boolean;
  editable?: boolean;
  linkedTo?: string;
}
