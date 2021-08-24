import { Component, Input, OnInit } from '@angular/core';
import { IPage } from '../../page/page.interface';
import { EditorService } from '../editor.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() pages: Record<string, IPage> = {};
  @Input() selectedPageId: string | undefined;
  @Input() highlightedPageId: string | undefined;
  @Input() funnelId: string | undefined;

  constructor(public editorApi: EditorService) { }

  ngOnInit(): void {
  }

  renamePage(a: any, b: any) { }

}
