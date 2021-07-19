import { IBlock } from "src/app/editor/block";

export interface IPage {
  id: string;
  blocks: IBlock[];
}
