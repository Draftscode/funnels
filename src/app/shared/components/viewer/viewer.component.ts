import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { IFunnel } from 'src/app/model/funnel.interface';
import { IWidget } from 'src/app/model/widget.interface';
import { FunnelService } from 'src/app/services/funnel.service';
import { IPage } from '../page/page.interface';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {
  funnels: IFunnel[] | undefined;
  currentPage: IPage | undefined;
  currentFunnel: IFunnel | undefined;
  private funnelId: string | undefined;
  private alive: boolean = true;
  constructor(
    private funnelApi: FunnelService,
    private currentRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.currentRoute.params.subscribe(params => {
      this.funnelId = params.funnelId;
      this.init();
    });

    this.funnelApi.getFunnels().pipe(takeWhile(() => this.alive)).subscribe((f: IFunnel[]) => {
      if (!f || !Array.isArray(f)) { return; }
      this.funnels = f;
      this.init();
    });
  }

  init(): void {
    if (!this.funnels || !this.funnelId) { return; }
    this.currentFunnel = this.funnels.find((f: IFunnel) => f.id === this.funnelId);
    const pageId: string | undefined = Object.keys(this.currentFunnel?.pages || {}).find((pId: string) => this.currentFunnel?.pages[pId].index === 0);
    if (!pageId) { return; }
    this.currentPage = this.currentFunnel?.pages[pageId];
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  afterClicked(widget: IWidget): void {

    if (widget.type === 'button') {
      if (!widget.linkedTo) { return; }
      this.currentPage = this.currentFunnel?.pages[widget.linkedTo];
    }
  }
}
