import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule } from "@angular/router";
import { MainNavContentComponent } from "./main-nav-content/main-nav-content.component";
import { MainNavComponent } from "./main-nav.component";

@NgModule({
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [
    MainNavComponent,
    MainNavContentComponent,
  ],
  exports: [
    MainNavComponent,
    MainNavContentComponent,
  ],
})
export class MainNavModule { }
