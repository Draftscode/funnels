import { IStyles } from "../../../model/styles";
import { IWidget } from "../../../model/widget";

export interface IBlock {
  id: string;
  height: number;
  curDragHeight: number;
  activated?: boolean;
  index: number;
  widgets?: Record<string, IWidget>;
  styles?: IStyles;
}
