import { IStyles } from "../../../model/styles";
import { IWidget } from "../../../model/widget.interface";

export interface IBlock {
  id: string;
  height: number;
  activated?: boolean;
  index: number;
  widgets: Record<string, IWidget>;
  styles?: IStyles;
  widgetIds?: string[];
}
