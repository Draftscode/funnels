import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { TranslateModule } from "@ngx-translate/core";
import { NgScrollbarModule } from "ngx-scrollbar";
import { SharedModule } from "../../shared.module";
import { TableComponent } from "./table.component";

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    MatTableModule,
    SharedModule,
    NgScrollbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [TableComponent],
  declarations: [TableComponent],
})
export class TableModule { }
