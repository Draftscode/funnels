import { CdkDrag, CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { IBlock } from "src/app/shared/components/editor/block.interface";
import * as pageActions from './page.actions';
import { IPage } from "./page.interface";
import * as fromPage from './page.reducer';

@Component({
  selector: 'app-page',
  templateUrl: 'page.component.html',
  styleUrls: ['page.component.scss'],
})
export class PageComponent implements OnChanges, OnInit {
  @Input() page: IPage | null = null;
  @Input() zoom: number = 1;
  width: number = 592;
  height: number = 288;
  fontSize: number = 14;
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
    if (changes.zoom) { this.scale(); }
    console.log(changes);
  }

  ngOnInit(): void {
    this.scale();
  }

  scale(): void {
    const zoom = this.zoom || 1;
    this.height = 592 * zoom;
    this.width = 288 * zoom;
    this.fontSize = 14 * zoom;
  }

  /** Predicate function that only allows even numbers to be dropped into a list. */
  enterPredicate(index: number, item: CdkDrag<IBlock>): boolean {
    if (!item.data) { return false; }
    return true;
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

  drop(event: CdkDragDrop<IBlock[]>): void {
    if (!this.page) { return; }
    const blocks: Record<string, IBlock> = this.page.blocks;
    // const tempName: string | undefined = Object.keys(blocks).find((id: string) => blocks[id].index === event.previousIndex);
    // if (!tempName) { return; }
    // const tmpIdx: number = blocks[tempName].index;


    // blocks[event.previousIndex].index = blocks[event.currentIndex].index;
    // blocks[event.currentIndex].index = tempIdx;
    // Object.keys(blocks).forEach((id: string) => {
    //   if (blocks[id].index >= event.currentIndex) {
    //     blocks[id].index++;
    //   }
    // });
    // moveItemInArray(blocks, event.previousIndex, event.currentIndex);
    // this.page.blocks = blocks;
  }

  onResize(e: { distance: { x: number; y: number; } }, block: IBlock): void {
    block.curDragHeight = (e?.distance?.y || 0);
  }

  resize(e: { distance: { x: number; y: number; } }, block: IBlock): void {
    block.curDragHeight = 0;
    block.height = (block.height + e.distance.y);

  }
}
