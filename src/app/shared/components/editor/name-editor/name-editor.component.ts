import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-name-editor',
  templateUrl: './name-editor.component.html',
  styleUrls: ['./name-editor.component.scss']
})
export class NameEditorComponent implements OnInit {
  @Input() name: string | undefined;
  @Output() changes: EventEmitter<string> = new EventEmitter<string>();
  editable: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  rename(el: HTMLInputElement): void {
    el.blur();
    this.changes.emit(el.value);
  }

}
