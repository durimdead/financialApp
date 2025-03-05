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
import { DialogDeleteElementConfirmationComponent } from '../dialogs/dialog-element-crud-operations/dialog-delete-element-confirmation/dialog-delete-element-confirmation.component';
import { PeriodicElement, PeriodicElementCrudData } from '../../app.interfaces';
import { DialogAddElementComponent } from '../dialogs/dialog-element-crud-operations/dialog-add-element/dialog-add-element.component';
import { ElementService } from '../element.service';

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

  // brings up modal to add another element of data
  openAddElementModal() {
	const modalData = this.elementService.getElementDataForCrudModal(0, this.elementService.crudStates.create);
    let dialogRef = this.dialog.open(DialogAddElementComponent, {
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
    let dialogRef = this.dialog.open(DialogAddElementComponent, {
      data: modalData,
    });

    // if the user confirms deletion
    const subscription = dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteElement(modalData.elementData.elementId);
      }
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // delete Element by elementId and refresh the table
  private deleteElement(elementId: number) {
    this.elementService.deleteElement(elementId);
    this.dataSource.data = this.elementService.getElements();
  }
  // save edited element and refresh the table
  private saveEditedElement(element: PeriodicElement) {
    this.elementService.updateElement(element);
    this.dataSource.data = this.elementService.getElements();
  }
  // will take the periodic element sent in, update Id to valid one, add to the table
  private addElement(elementToAdd: PeriodicElement) {
    this.elementService.addElement(elementToAdd);
    this.dataSource.data = this.elementService.getElements();
  }

  // opens modal to edit element
  editElement(elementId: number) {
    const modalData = this.elementService.getElementDataForCrudModal(
      elementId,
      this.elementService.crudStates.update
    );
    let dialogRef = this.dialog.open(DialogAddElementComponent, {
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
            console.log(e);
          }
        }
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // return object with element data
  getElementDataById(elementId: number) {
    return this.dataSource.data.find(
      (item) => item.elementId === elementId
    ) as PeriodicElement;
  }
}
