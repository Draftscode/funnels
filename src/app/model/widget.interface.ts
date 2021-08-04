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
  image?: IImage;
  background?: string;
}
