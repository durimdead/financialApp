import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ViewChild,
  inject,
} from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteElementConfirmationComponent } from './dialog-delete-element-confirmation/dialog-delete-element-confirmation.component';
import { PeriodicElement } from '../../app.interfaces';
import { DialogAddElementComponent } from './dialog-add-element/dialog-add-element.component';
import { ElementService } from '../element.service';
import { FormValidators } from '../../app.form-validators';

@Component({
  selector: 'app-material-test',
  imports: [MatTableModule, MatSortModule, MatButtonModule, MatIconModule],
  templateUrl: './material-test.component.html',
  styleUrl: './material-test.component.css',
})
export class MaterialTestComponent implements AfterViewInit {
  private elementService = inject(ElementService);
  private destroyRef = inject(DestroyRef);
  readonly dialog = inject(MatDialog);
  private _liveAnnouncer = inject(LiveAnnouncer);

  // makeshift way of naming HTML element ids to grab the data from the HTML table
  // since the way Angular Material doesn't lend itself well to the way I wanted to
  // use it
  identifiers = {
    name: 'elementName_',
    weight: 'elementWeight_',
    symbol: 'elementSymbol_',
  };

  displayedColumns: string[] = [
    'actions',
    'elementId',
    'name',
    'weight',
    'symbol',
  ];
  dataSource = new MatTableDataSource(this.elementService.getElements());

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
  openAddRowModal() {
    let dialogRef = this.dialog.open(DialogAddElementComponent, {
      data: JSON.stringify({itemState: this.elementService.crudStates.create}),
    });

    // if the user submits a new element, we will get back an element to add to the table, else ''
    const subscription = dialogRef
      .afterClosed()
      .subscribe((result: PeriodicElement | '') => {
        if (result !== '') {
          this.addRow(result);
        }
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // will take the periodic element sent in, update Id to valid one, add to the table
  addRow(elementToAdd: PeriodicElement) {
    if (elementToAdd.elementId < 1) {
      elementToAdd.elementId = this.elementService.getNextElementId();
    }
    this.elementService.addElement(elementToAdd);
    this.dataSource.data = this.elementService.getElements();
  }

  // requests confirmation of row deletion, then deletes row
  confirmDeleteRow(rowId: number) {
    console.log('delete: ' + rowId);
    const currentRow = this.getRowDataById(rowId);

    // open the dialog and send data to display
    let dialogRef = this.dialog.open(DialogDeleteElementConfirmationComponent, {
      data: JSON.stringify(currentRow),
    });

    // if the user confirms deletion
    const subscription = dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteElement(currentRow.elementId);
      }
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // delete Element by rowId and refresh the table
  deleteElement(elementId: number) {
    this.elementService.deleteElement(elementId);
    this.dataSource.data = this.elementService.getElements();
  }

  // updates row state to editable
  editRow(rowId: number) {
    console.log('edit: ' + rowId);
    let currentRow = this.getRowDataById(rowId);
    if (currentRow?.elementId > 0) {
      currentRow.isEditing = true;
    }

    this.updateElementArrayWithDataSource();
  }

  // saves new data into row and changes state to no longer be in edit mode
  saveRow(rowId: number) {
    console.log('save: ' + rowId);
    let currentRow = this.getAllRowDataToSave(rowId);
    if (currentRow) {
      currentRow.isEditing = false;
    }

    this.updateElementArrayWithDataSource();
  }

  // return object with row data
  getRowDataById(rowId: number) {
    return this.dataSource.data.find(
      (item) => item.elementId === rowId
    ) as PeriodicElement;
  }

  // returns an object with all valid, updated row data
  getAllRowDataToSave(rowId: number) {
    let oldRowData = this.getRowDataById(rowId) as PeriodicElement;
    let rowData: PeriodicElement = oldRowData;

    // if the new value for the weight is NaN, revert to previous value before update
    let weightOfElement = (
      document.getElementById(
        this.identifiers.weight + rowData?.elementId
      ) as HTMLInputElement
    ).value;
    rowData.weight = Number.isNaN(Number(weightOfElement))
      ? oldRowData.weight
      : Number(weightOfElement);

    rowData.name = (
      document.getElementById(
        this.identifiers.name + rowData?.elementId
      ) as HTMLInputElement
    ).value;
    rowData.symbol = (
      document.getElementById(
        this.identifiers.symbol + rowData?.elementId
      ) as HTMLInputElement
    ).value;

    return rowData;
  }

  // if the datasource for the table has been updated and we need to update the "source data" with the new information
  //TODO: do this better!
  updateElementArrayWithDataSource() {
    this.dataSource.data = this.elementService.updateDataSource(
      this.dataSource.data
    );
  }
}
