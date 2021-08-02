import { Component } from "@angular/core";
import { IImage } from "./image.interface";

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image.dialog.html',
  styleUrls: ['./image.dialog.scss'],
})
export class ImageDialog {
  curImage: IImage | undefined;
  constructor() { }

  selectImage(img: IImage): void {
    this.curImage = img;
  }

  useImage(): void {

  }
}
