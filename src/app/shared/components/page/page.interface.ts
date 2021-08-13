import { IBlock } from "src/app/shared/components/editor/block.interface";

export interface IPage {
  id: string;
  index: number;
  name?: string;
  funnelId?: string;
  blockIds?: string[];
  background?: string;
  opacity?: number;
}
