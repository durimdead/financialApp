import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteElementConfirmationComponent } from './dialog-delete-element-confirmation/dialog-delete-element-confirmation.component';
import { PeriodicElement } from '../../app.interfaces';
import { DialogAddElementComponent } from './dialog-add-element/dialog-add-element.component';



@Component({
  selector: 'app-material-test',
  imports: [MatTableModule, MatSortModule, MatButtonModule, MatIconModule],
  templateUrl: './material-test.component.html',
  styleUrl: './material-test.component.css',
})
export class MaterialTestComponent implements AfterViewInit {
  private ELEMENT_DATA: PeriodicElement[] = [
    { isEditing: false, actions: '',elementId: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { isEditing: false, actions: '',elementId: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { isEditing: false, actions: '',elementId: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { isEditing: false, actions: '',elementId: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { isEditing: false, actions: '',elementId: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { isEditing: false, actions: '',elementId: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { isEditing: false, actions: '',elementId: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { isEditing: false, actions: '',elementId: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { isEditing: false, actions: '',elementId: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { isEditing: false, actions: '',elementId: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ];

  identifiers = {
    name: 'elementName_',
    weight: 'elementWeight_',
    symbol: 'elementSymbol_'
  };
  readonly dialog = inject(MatDialog);
  private _liveAnnouncer = inject(LiveAnnouncer);
  displayedColumns: string[] = ['actions', 'elementId', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

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
  openAddRowModal(){
    //TODO: initialize modal to add new row
    console.log('adding new row');
    
    let dialogRef = this.dialog.open(DialogAddElementComponent);

    dialogRef.afterClosed().subscribe((result: PeriodicElement) => {
      // this.addRow(result);
      console.log(result);
    });
  }

  //TODO: delete this method as it's not needed after modal is working.
  testAddNewElement(){
    let newElement: PeriodicElement = {
      elementId: 0,
      isEditing: false,
      actions: '',
      name: 'someElement',
      weight: 1.023,
      symbol: 'NA',
    }
    this.addRow(newElement);
  }

  addRow(elementToAdd: PeriodicElement){
    const elementIds = this.ELEMENT_DATA.map(element => element.elementId);
    elementToAdd.elementId = Math.max(...elementIds) + 1;
    this.ELEMENT_DATA.push(elementToAdd);
    this.dataSource.data = this.ELEMENT_DATA;
  }

  // requests confirmation of row deletion, then deletes row
  confirmDeleteRow(rowId: number){
    console.log('delete: ' + rowId);
    const currentRow = this.getRowDataById(rowId);
    
    // open the dialog and send data to display
    let dialogRef = this.dialog.open(DialogDeleteElementConfirmationComponent, {
      data: JSON.stringify(currentRow)
    });

    // if the user confirms deletion
    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.deleteElement(currentRow.elementId);
      }
    });
  }

  // delete Element by rowId
  deleteElement(rowId: number){
    this.ELEMENT_DATA = this.dataSource.data.filter(itemToDelete => itemToDelete.elementId !== rowId);
    this.dataSource.data = this.ELEMENT_DATA;
  }

  // updates row state to editable
  editRow(rowId: number){
    console.log('edit: ' + rowId);
    let currentRow = this.getRowDataById(rowId);
    if (currentRow?.elementId > 0){
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
    return this.dataSource.data.find((item) => item.elementId === rowId) as PeriodicElement;
  }

  // returns an object with all valid, updated row data
  getAllRowDataToSave(rowId: number){
    let oldRowData = this.getRowDataById(rowId) as PeriodicElement;
    let rowData: PeriodicElement = oldRowData;

    // if the new value for the weight is NaN, revert to previous value before update
    let weightOfElement = (document.getElementById(this.identifiers.weight + rowData?.elementId) as HTMLInputElement).value;
    rowData.weight = Number.isNaN(Number(weightOfElement)) ? oldRowData.weight : Number(weightOfElement);
    
    rowData.name = (document.getElementById(this.identifiers.name + rowData?.elementId) as HTMLInputElement).value;
    rowData.symbol = (document.getElementById(this.identifiers.symbol + rowData?.elementId) as HTMLInputElement).value;
    
    return rowData;
  }
}
