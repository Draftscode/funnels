import { Pipe, PipeTransform } from '@angular/core';
import { TWidgetType } from 'src/app/model/widget.interface';

// Tell Angular2 we're creating a Pipe with TypeScript decorators
@Pipe({
  name: 'sortByIndex',
  pure: false,
})
export class SortByIndexPipe implements PipeTransform {

  transform(value: Record<string, TWidgetType> | undefined): TWidgetType[] {
    if (!value) { return []; }

    const results: TWidgetType[] = Object.keys(value)
      .map((wKey: string) => value[wKey])
      .sort((w1: TWidgetType, w2: TWidgetType) => {
        return w1.index < w2.index ? -1 : 1;
      });

    return results;
  }
}
