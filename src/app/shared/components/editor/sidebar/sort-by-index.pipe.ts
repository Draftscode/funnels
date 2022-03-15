import { Pipe, PipeTransform } from '@angular/core';
import { IPage } from '../../page/page.interface';

type Item = { key: string, value: IPage };

@Pipe({ name: 'sortByIndex' })
export class SortByIndexPipe implements PipeTransform {
  transform(items: Item[]): any {
    return items.sort((a: Item, b: Item) => a.value.index < b.value.index ? -1 : 1);
  }
}
