import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface PeriodicElement {
  isEditing: boolean;
  actions: string;
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { isEditing: false, actions: '',position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { isEditing: false, actions: '',position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { isEditing: false, actions: '',position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { isEditing: false, actions: '',position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { isEditing: false, actions: '',position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { isEditing: false, actions: '',position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { isEditing: false, actions: '',position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { isEditing: false, actions: '',position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { isEditing: false, actions: '',position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { isEditing: false, actions: '',position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
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

  // brings up modal to add another row of data
  addRow(){
    //TODO: initialize modal to add new row
    console.log('adding new row');
  }

  // requests confirmation of row deletion, then deletes row
  deleteRow(rowId: number){
    //TODO: initialize confirmation of deletion of row, then delete row upon confirmation (probably needs more methods)
    console.log('delete: ' + rowId);
  }
  
  // updates row state to editable
  editRow(rowId: number){
    console.log('edit: ' + rowId);
    let currentRow = this.getRowDataById(rowId);
    if (currentRow){
      currentRow.isEditing = true;
    }
  }
  
  // saves new data into row and changes state to no longer be in edit mode
  saveRow(rowId: number){
    console.log('save: ' + rowId);
    let currentRow = this.getAllRowDataToSave(rowId);
    if (currentRow){
      currentRow.isEditing = false;
    }
  }

  // return object with row data
  getRowDataById(rowId: number){
    return this.dataSource.data.find((item) => item.position === rowId);
  }

  // returns an object with all valid, updated row data
  getAllRowDataToSave(rowId: number){
    let oldRowData = this.getRowDataById(rowId) as PeriodicElement;
    let rowData: PeriodicElement = oldRowData;

    // if the new value for the weight is NaN, revert to previous value before update
    let weightOfElement = (document.getElementById('elementWeight_' + rowData?.position) as HTMLInputElement).value;
    rowData.weight = Number.isNaN(Number(weightOfElement)) ? oldRowData.weight : Number(weightOfElement);
    
    rowData.name = (document.getElementById('elementName_' + rowData?.position) as HTMLInputElement).value;
    rowData.symbol = (document.getElementById('elementSymbol_' + rowData?.position) as HTMLInputElement).value;
    
    return rowData;
  }
}
