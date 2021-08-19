import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { TranslateModule } from "@ngx-translate/core";
import { NgScrollbarModule } from "ngx-scrollbar";
import { ConfirmDialogModule } from "../../dialog/confirm-dialog/confirm-dialog.module";
import { SharedModule } from "../../shared.module";
import { ResponseModule } from "../response/response.module";
import { TableComponent } from "./table.component";

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    MatTableModule,
    SharedModule,
    NgScrollbarModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    ResponseModule,
    ConfirmDialogModule,
  ],
  exports: [TableComponent],
  declarations: [TableComponent],
})
export class TableModule { }
