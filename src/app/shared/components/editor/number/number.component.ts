import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss']
})
export class NumberComponent implements OnInit {
  @Input() value: number = 0;
  @Input() activated: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
