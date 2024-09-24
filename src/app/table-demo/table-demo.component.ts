import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { TableDemoDataSource, TableDemoItem } from './table-demo-datasource';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-table-demo',
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDemoComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<TableDemoItem>;
  dataSource: TableDemoDataSource;
  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  data: any;

  ngOnInit() {
    this.dataSource = new TableDemoDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.data = this.dataSource.connect();
  }

  getCurrencyDisplay(value: number): string {
    return this.formatter.format(value);
  }
}
