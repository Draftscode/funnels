import { IBlock } from "src/app/shared/components/editor/block.interface";

export interface IPage {
  id: string;
  blocks: Record<string, IBlock>;
}
