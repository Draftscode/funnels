import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { TranslateModule } from "@ngx-translate/core";
import { NgScrollbarModule } from "ngx-scrollbar";
import { TableComponent } from "./table.component";

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    MatTableModule,
    MatSlideToggleModule,
    MatToolbarModule,
    NgScrollbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [TableComponent],
  declarations: [TableComponent],
})
export class TableModule { }
