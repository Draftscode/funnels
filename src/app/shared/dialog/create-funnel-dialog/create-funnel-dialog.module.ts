import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PageModule } from '../../components/page/page.module';
import { PreviewModule } from '../../components/table/preview/preview.module';
import { CreateFunnelDialogComponent } from './create-funnel-dialog.component';



@NgModule({
  declarations: [
    CreateFunnelDialogComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    PreviewModule,
    PageModule,
    MatDividerModule,
  ],
  exports: [CreateFunnelDialogComponent],
})
export class CreateFunnelDialogModule { }
