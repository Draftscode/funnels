import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  pages: number;
  template: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', pages: 12, template: 'Business', weight: 1.0079, symbol: 'facebook' },
  { position: 2, name: 'Helium', pages: 12, template: 'Business', weight: 4.0026, symbol: 'facebook' },
  { position: 3, name: 'Lithium', pages: 12, template: 'Kalender', weight: 6.941, symbol: 'facebook' },
  { position: 4, name: 'Beryllium', pages: 12, template: 'Kalender', weight: 9.0122, symbol: 'facebook' },
  { position: 5, name: 'Boron', pages: 12, template: 'Kalender', weight: 10.811, symbol: 'facebook' },
  { position: 6, name: 'Carbon', pages: 12, template: 'Quiz', weight: 12.0107, symbol: 'facebook' },
  { position: 7, name: 'Nitrogen', pages: 12, template: 'Quiz', weight: 14.0067, symbol: 'facebook' },
  { position: 8, name: 'Oxygen', pages: 12, template: 'Quiz', weight: 15.9994, symbol: 'facebook' },
  { position: 9, name: 'Fluorine', pages: 12, template: 'Kalender', weight: 18.9984, symbol: 'facebook' },
  { position: 10, name: 'Neon', pages: 12, template: 'Kalender', weight: 20.1797, symbol: 'facebook' },
];

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'template', 'pages', 'weight', 'symbol','actions'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
