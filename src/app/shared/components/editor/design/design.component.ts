import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { TWidgetType } from 'src/app/model/widget.interface';
import { BlockService } from 'src/app/services/block.service';
import { WidgetService } from 'src/app/services/widget.service';
import { DialogResult, DialogResultType } from 'src/app/shared/dialog/dialog-result.interface';
import { ImageDialogService } from 'src/app/shared/dialog/image-dialog/image-dialog.service';
import { IImage } from '../../images/image.interface';
import { IBlock } from '../block.interface';
import { EditorService } from '../editor.service';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnDestroy {
  selectedBlockId: string | undefined;
  selectedWidgetId: string | undefined;
  blocks: Record<string, IBlock> = {};
  widgets: Record<string, TWidgetType> = {};
  private alive: boolean = true;

  constructor(
    private editorApi: EditorService,
    private widgetApi: WidgetService,
    private blockApi: BlockService,
    private imageDialogService: ImageDialogService,
  ) {
    this.editorApi.selectedBlockIdChanged().pipe(takeWhile(() => this.alive)).subscribe((item: string | undefined) => this.selectedBlockId = item);
    this.editorApi.selectedWidgetIdChanged().pipe(takeWhile(() => this.alive)).subscribe((item: string | undefined) => this.selectedWidgetId = item);
    this.editorApi.widgetsChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, TWidgetType>) => this.widgets = items);
    this.editorApi.blocksChanged().pipe(takeWhile(() => this.alive)).subscribe((items: Record<string, IBlock>) => this.blocks = items);
  }

  get block(): IBlock | undefined {
    if (!this.selectedBlockId) { return undefined; }
    return this.blocks[this.selectedBlockId];
  }

  get widget(): TWidgetType | undefined {
    if (!this.selectedWidgetId) { return undefined; }
    return this.widgets[this.selectedWidgetId];
  }

  updateImage(type: 'widget' | 'block'): void {
    const image: IImage | undefined = type === 'widget' ? this.widget?.image : this.block?.image;
    this.imageDialogService.open({ image }).subscribe((r: DialogResult) => {

      if (r?.type !== DialogResultType.CONFIRM || !r?.data) { return; }
      if (type === 'widget') { this.changeWidget({ image: r.data?.image }); }
      else if (type === 'block') { this.changeBlock({ image: r.data?.image }); }

    });
  }

  parseValue(val: string | number | undefined): number {
    if (!val) { return 0; }
    if (typeof val === 'string') {
      return parseFloat(val) || 0;
    }

    return val;
  }


  /**
   * changes properties of a widget
   * @param {Record<string,any>} changes map of the properties changed
   * @returns void
   */
  changeWidget(changes: Record<string, any>): void {
    if (!this.widget) { return; }
    this.widgetApi.updateProperty(this.widget.id, changes).subscribe();
  }

  /**
   * changes properties of a block
   * @param {Record<string,any>} changes map of the properties changed
   * @returns void
   */
  changeBlock(changes: Record<string, any>): void {
    if (!this.block) { return; }
    this.blockApi.updateProperty(this.block.id, changes).subscribe();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
