import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

export interface PeriodicElement {
  actions: string;
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { actions: '',position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { actions: '',position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { actions: '',position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { actions: '',position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { actions: '',position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { actions: '',position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { actions: '',position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { actions: '',position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { actions: '',position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { actions: '',position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-material-test',
  imports: [MatTableModule, MatSortModule, MatButtonModule, MatIconModule],
  templateUrl: './material-test.component.html',
  styleUrl: './material-test.component.css',
})
export class MaterialTestComponent implements AfterViewInit {
  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns: string[] = ['actions', 'position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  test(message: string){
    console.log(message);
  }
}
