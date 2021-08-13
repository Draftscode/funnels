import { NgModule } from "@angular/core";
import { AlphaChannelPipe } from "./alpha.pipe";
import { SortByIndexPipe } from "./sort-by-index.pipe";

@NgModule({
  declarations: [
    SortByIndexPipe,
    AlphaChannelPipe,
  ],
  exports: [
    SortByIndexPipe,
    AlphaChannelPipe,
  ],
})
export class PipeModule { }
