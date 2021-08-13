import { Pipe, PipeTransform } from '@angular/core';
import { GlobalUtils } from 'src/app/utils/global.utils';

// Tell Angular2 we're creating a Pipe with TypeScript decorators
@Pipe({
  name: 'alpha',
})
export class AlphaChannelPipe implements PipeTransform {
  transform(color: string | undefined, alpha: number | undefined): string | undefined {
    if (!color || typeof alpha !== 'number') { return color; }
    const rgba: string = GlobalUtils.addAlpha(color, alpha) || color;
    return this.hexToRgbA(rgba);
  }

  hexToRgbA(hex: string): string {
    let c: string[] = [];
    c = hex.substring(1).split('');
    if (c.length === 7) { c = [c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[6]]; }
    let res: any = '0x' + c.join('');
    const alphaValue: number = c.length === 6 ? 0 : (100 / 255 * (res & 255)) / 100;
    const rgba: string = 'rgba(' + [(res >> 24) & 255, (res >> 16) & 255, (res >> 8) & 255].join(',') + ',' + alphaValue + ')';
    return rgba;
  }

}
