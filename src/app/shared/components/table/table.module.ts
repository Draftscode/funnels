import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { NgScrollbarModule } from "ngx-scrollbar";
import { TableComponent } from "./table.component";

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    NgScrollbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [TableComponent],
  declarations: [TableComponent],
})
export class TableModule { }
