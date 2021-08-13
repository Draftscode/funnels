export class GlobalUtils {
  /**
   * generates random uuid
   * @returns string
   */
  public static uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
      const r: number = Math.random() * 16 | 0;
      const v: number = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public static addAlpha(color: string | undefined, opacity: number): string | undefined {
    if (!color) { return color; }
    const _opacity = Math.round(Math.min(Math.max(opacity, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }
}
