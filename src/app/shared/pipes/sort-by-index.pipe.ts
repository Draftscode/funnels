import { Pipe, PipeTransform } from '@angular/core';
import { IWidget } from 'src/app/model/widget.interface';

// Tell Angular2 we're creating a Pipe with TypeScript decorators
@Pipe({
  name: 'sortByIndex',
  pure: false,
})
export class SortByIndexPipe implements PipeTransform {

  transform(value: Record<string, IWidget> | undefined): IWidget[] {
    if (!value) { return []; }

    const results: IWidget[] = Object.keys(value)
      .map((wKey: string) => value[wKey])
      .sort((w1: IWidget, w2: IWidget) => {
        return w1.index < w2.index ? -1 : 1;
      });

    return results;
  }
}
