import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TWidgetType } from 'src/app/model/widget.interface';
import { BlockService } from 'src/app/services/block.service';
import { PageService } from 'src/app/services/page.service';
import { WidgetService } from 'src/app/services/widget.service';
import { ImageDialog } from '../../images/dialog/image.dialog';
import { IImage } from '../../images/image.interface';
import { IPage } from '../../page/page.interface';
import { IBlock } from '../block.interface';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnInit, OnChanges {
  @Input() widget: TWidgetType | undefined;
  @Input() block: IBlock | undefined;
  @Input() page: IPage | undefined;

  constructor(
    private dialog: MatDialog,
    private widgetApi: WidgetService,
    private blockApi: BlockService,
    private pageApi: PageService,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  updateImage(type: 'widget' | 'block'): void {
    const image: IImage | undefined = type === 'widget' ? this.widget?.image : this.block?.image;
    this.dialog.open(ImageDialog, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '90%',
      width: '90%',
      panelClass: 'lightbox',
      data: { image },
    }).afterClosed().subscribe((r) => {
      if (r?.type !== 'confirm') { return; }

      if (type === 'widget') { this.changeWidget({ image: r.image }); }
      else if (type === 'block') { this.changeBlock({ image: r.image }); }

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

  /**
   * changes properties of a page
   * @param {Record<string,any>} changes map of the properties changed
   * @returns void
   */
  changePage(changes: Record<string, any>): void {
    if (!this.page) { return; }
    this.pageApi.updateProperty(this.page.id, changes).subscribe();
  }

  change(a: any): void {
  }
}
