import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { IBlock } from "src/app/shared/components/editor/block.interface";
import { BLOCK_STORAGE_NAME } from "../../state/block/block.state";
import { IPage } from "./page.interface";

@Component({
  selector: 'app-page',
  templateUrl: 'page.component.html',
  styleUrls: ['page.component.scss'],
})
export class PageComponent implements OnChanges, OnInit {
  @Input() editable: boolean = false;
  @Input() page: IPage | null = null;
  @Input() zoom: number = 1;
  width: number = 592;
  height: number = 288;
  fontSize: number = 14;
  @Select((state: any) => state[BLOCK_STORAGE_NAME].entities) blocks$!: Observable<Record<string, IBlock>>;

  @ViewChild('textEditor') set editor(textEditor: ElementRef) {
    if (!textEditor) { return; }
    textEditor.nativeElement.focus();
  }

  // constructor(private store: Store<fromPage.PageState>) { }

  activateBlock(item: IBlock): void {
    if (!this.page) { return; }
    const blocks: Record<string, IBlock> = this.page.blocks;
    Object.keys(blocks).forEach((id: string) => blocks[id].activated = false);
    item.activated = true;
    // this.store.dispatch(new pageActions.Update(this.page.id, this.page));
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }


  get sortedBlocks(): string[] {
    const blocks: Record<string, IBlock> | undefined = this.page?.blocks;
    if (!blocks) { return []; }
    const s: string[] = Object.keys(blocks)
      .sort((id1: string, id2: string) => {
        return blocks[id1].index < blocks[id2].index ? -1 : 1;
      });

    return s;
  }


  onResize(e: { distance: { x: number; y: number; } }, block: IBlock): void {
    // block.curDragHeight = (e?.distance?.y || 0);
  }

  resize(e: { distance: { x: number; y: number; } }, block: IBlock): void {
    // block.curDragHeight = 0;
    block.height = (block.height + e.distance.y);

  }
}
