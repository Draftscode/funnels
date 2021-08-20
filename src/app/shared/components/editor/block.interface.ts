import { IStyles } from "../../../model/styles";
import { TWidgetType } from "../../../model/widget.interface";
import { IImage } from "../images/image.interface";

export interface IBlock {
  id: string;
  height: number;
  activated?: boolean;
  index: number;
  styles?: IStyles;
  widgetIds: string[];
  background: string;
  image?: IImage;
  opacity?: number;
  backgroundOpacity: number;
  imageOpacity: number;
}
