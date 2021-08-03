import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { IImage } from "../image.interface";

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image.dialog.html',
  styleUrls: ['./image.dialog.scss'],
})
export class ImageDialog {
  curImage: IImage | undefined;
  constructor(private dialog: MatDialogRef<ImageDialog>) {

  }

  selectImage(img: IImage): void {
    this.curImage = img;
  }

  useImage(): void {
    this.dialog.close({ type: 'confirm', image: this.curImage });
  }
}
