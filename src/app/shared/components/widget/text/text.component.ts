import { Component, Input, OnInit } from '@angular/core';
import { IText } from 'src/app/model/widget.interface';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {
  @Input() widget: IText | undefined;
  @Input() activated: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
