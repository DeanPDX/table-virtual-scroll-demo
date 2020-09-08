import { DataSource } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

export class TableDemoItem {
  id: number;
  name: string;
  net: number;
  gross: number;
  created: Date;
  updated: Date;
  total: number;
  constructor(id: number, name: string, net: number, gross: number, created: Date, updated: Date, total: number) {
    this.id = id;
    this.name = name;
    this.net = net;
    this.gross = gross;
    this.created = created;
    this.updated = updated;
    this.total = total;
  }
}

/**
 * Data source for the TableDemo view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TableDemoDataSource extends DataSource<TableDemoItem> {
  data: TableDemoItem[] = [];
  sort: MatSort;

  constructor() {
    super();
    for (let i = 0; i < 1000000; i++) {
      this.data.push(new TableDemoItem(i, this.getRandomString(this.getRandomInt(20)), this.getRandomInt(5000), this.getRandomInt(10000), this.getRandomDate(), this.getRandomDate(), this.getRandomInt(100000)));
    }
  }

  getRandomString(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  getRandomDate() {
    let start = new Date(2012, 0, 1);
    let end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TableDemoItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getSortedData([...this.data]);
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() { }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TableDemoItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'net': return compare(+a.net, +b.net, isAsc);
        case 'gross': return compare(+a.gross, +b.gross, isAsc);
        case 'total': return compare(+a.total, +b.total, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
