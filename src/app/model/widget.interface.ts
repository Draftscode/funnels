import { IImage } from "../shared/components/images/image.interface";
import { EWidgetType } from "./widget-type.enum";

export interface IWidget {
  id: string;
  type?: EWidgetType;
  text?: string;
  activated?: boolean;
  editable?: boolean;
  index: number;
  linkedTo?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  image?: IImage;
  background?: string;
  backgroundOpacity?: number;
  fontWeight?: string;
  fontStyle?: string;
  opacity?: number;
  imageOpacity?: number;
}

export interface ISubscriptionForm extends IWidget {
  kind: 'subscription';
  mail: boolean;
  phone: boolean;
  name: boolean;
}

export interface IButton extends IWidget {
  kind: 'button';
}

export interface ICalendar extends IWidget {
  kind: 'calendar';
}

export interface IText extends IWidget {
  kind: 'text';
}

export type TWidgetType = IText | IButton | ICalendar | ISubscriptionForm;
