import { IStyles } from "../model/styles";
import { IWidget } from "../model/widget";

export interface IBlock {
  id: string;
  height: number;
  curDragHeight: number;
  activated?: boolean;
  widgets?: IWidget[];
  styles?: IStyles;
}
