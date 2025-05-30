import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ViewChild,
  inject,
} from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PeriodicElement } from '../../app.interfaces';
import { ElementService } from '../services/periodic-elements/element.service';
import { DialogElementCrudOperationsComponent } from '../dialogs/material-test-elements/dialog-element-crud-operations/dialog-element-crud-operations.component';

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
  private elementData = this.elementService.ELEMENT_DATA;

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
    'elementID',
    'elementName',
    'elementWeight',
    'elementSymbol',
  ];
  dataSource = new MatTableDataSource(this.elementData());

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngAfterViewInit() {
    this.updateElementsDataFromSource();
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

  // brings up modal to add another element of data
  openAddElementModal() {
    const modalData = this.elementService.getElementDataForCrudModal(
      0,
      this.elementService.crudStates.create
    );
    let dialogRef = this.dialog.open(DialogElementCrudOperationsComponent, {
      data: modalData,
    });

    // if the user submits a new element, we will get back an element to add to the table, else ''
    const subscription = dialogRef
      .afterClosed()
      .subscribe((result: PeriodicElement | '') => {
        if (result !== '') {
          this.addElement(result);
        }
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // requests confirmation of element deletion, then deletes element
  confirmDeleteElement(elementId: number) {
    const modalData = this.elementService.getElementDataForCrudModal(
      elementId,
      this.elementService.crudStates.delete
    );

    // open the dialog and send data to display
    let dialogRef = this.dialog.open(DialogElementCrudOperationsComponent, {
      data: modalData,
    });

    // if the user confirms deletion
    const subscription = dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteElement(modalData.elementData.elementID);
      }
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // delete Element by elementId and refresh the table
  private deleteElement(elementId: number) {
    // this.elementService.deleteElement(elementId);
    // this.refreshMatTableDataSource();

    const subscription = this.elementService
      .deleteElement(elementId)
      .subscribe({
        next: (results) => {
          if (results.httpStatusCode === 200) {
            this.updateElementsDataFromSource();
          } else {
            console.error(
              'server error deleting elementId ' +
                elementId +
                '. Error: ' +
                results.errorMessage
            );
          }
        },
        error: (error: Error) => {
          console.error('error deleting elementId ' + elementId + '. Error: ');
          console.error(error);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  // save edited element and refresh the table
  private saveEditedElement(element: PeriodicElement) {
    // this.elementService.updateElement(element);
    const subscription = this.elementService.updateElement(element).subscribe({
      next: (results) => {
        if (results.httpStatusCode === 200) {
          this.updateElementsDataFromSource();
        } else {
          console.error(
            'server error updating elementId ' +
              element.elementID +
              '. Error: ' +
              results.errorMessage
          );
        }
      },
      error: (error: Error) => {
        console.error(
          'error updating elementId ' + element.elementID + '. Error: '
        );
        console.error(error);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  // will take the periodic element sent in, update Id to valid one, add to the table
  private addElement(elementToAdd: PeriodicElement) {
    const subscription = this.elementService
      .addElement(elementToAdd)
      .subscribe({
        next: (results) => {
          if (results.httpStatusCode === 200) {
            this.updateElementsDataFromSource();
          } else {
            console.error(
              'server error adding element - element name "' +
                elementToAdd.elementName +
                '". Error: ' +
                results.errorMessage
            );
          }
        },
        error: (error: Error) => {
          console.error(
            'error adding new element - element name - "' +
              elementToAdd.elementName +
              '". Error: '
          );
          console.error(error);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // opens modal to edit element
  editElement(elementId: number) {
    const modalData = this.elementService.getElementDataForCrudModal(
      elementId,
      this.elementService.crudStates.update
    );
    let dialogRef = this.dialog.open(DialogElementCrudOperationsComponent, {
      data: modalData,
    });

    // if the user submits a new element, we will get back an element to add to the table, else ''
    const subscription = dialogRef
      .afterClosed()
      .subscribe((result: PeriodicElement | '') => {
        if (result !== '') {
          try {
            this.saveEditedElement(result);
          } catch (e) {
            //TODO: better error handling
            console.error(e);
          }
        }
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // gets the data from the "source" (i.e. the API) and then refreshes the table appropriately
  updateElementsDataFromSource() {
    const subscription = this.elementService.elementsFetcher().subscribe({
      error: (error: Error) => {
        console.error('error fetching elements from server: ');
        console.error(error);
      },
      complete: () => {
        this.refreshMatTableDataSource();
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // a little bit of a hack, but the most effective, simple way to update the datasource for
  // the material table.
  refreshMatTableDataSource() {
    this.dataSource.data = this.elementData();
  }
}
