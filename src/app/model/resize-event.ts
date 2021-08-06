export class ResizeEvent {
  private oldWidth: number | undefined;
  private newWidth: number | undefined;
  private oldHeight: number | undefined;
  private newHeight: number | undefined;

  constructor(initialWidth: number, initialHeight: number) {
    this.setNewWidth(initialWidth);
    this.setNewHeight(initialHeight);
  }

  public getOldWidth(): number | undefined {
    return this.oldWidth;
  }

  public setOldWidth(oldWidth: number | undefined): this {
    this.oldWidth = oldWidth; return this;
  }

  public getNewWidth(): number | undefined {
    return this.newWidth;
  }

  public setNewWidth(newWidth: number | undefined): this {
    this.newWidth = newWidth; return this;
  }

  public getOldHeight(): number | undefined {
    return this.oldHeight;
  }

  public setOldHeight(oldHeight: number | undefined): this {
    this.oldHeight = oldHeight; return this;
  }

  public getNewHeight(): number | undefined {
    return this.newHeight;
  }

  public setNewHeight(newHeight: number | undefined): this {
    this.newHeight = newHeight; return this;
  }

}
