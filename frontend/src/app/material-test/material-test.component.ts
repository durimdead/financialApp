import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PeriodicElement } from '../../app.interfaces';
import { ElementService } from '../element.service';
import { DialogElementCrudOperationsComponent } from '../dialogs/dialog-element-crud-operations/dialog-element-crud-operations.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-material-test',
  imports: [MatTableModule, MatSortModule, MatButtonModule, MatIconModule],
  templateUrl: './material-test.component.html',
  styleUrl: './material-test.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    'elementId',
    'name',
    'weight',
    'symbol',
  ];
  dataSource = signal<MatTableDataSource<PeriodicElement, MatPaginator>>(
    new MatTableDataSource(this.elementData())
  );
  DSMatTable = this.elementService.DS_MAT_TABLE;
  asyncDataSource: any;

  ngOnInit() {
    // this.elementService.getElements();
    // this.fillElementData();
    this.updateElementsDataFromSource();
    console.log('element data inside material-test ngOnInit():');
    console.log(this.elementData);
  }

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngAfterViewInit() {
    //TODO: fix this mess of a situation to make it no longer use SetInterval()
    console.log('afterViewInit');
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
    this.dataSource().data = this.elementData();
  }
  // save edited element and refresh the table
  private saveEditedElement(element: PeriodicElement) {
    this.elementService.updateElement(element);
    this.dataSource().data = this.elementData();
  }
  // will take the periodic element sent in, update Id to valid one, add to the table
  private addElement(elementToAdd: PeriodicElement) {
    this.elementService.addElement(elementToAdd);
    this.dataSource().data = this.elementData();
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
            console.log(e);
          }
        }
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  getElementServiceELEMENT_DATA() {
    return this.elementService.ELEMENT_DATA();
  }

  getElementService_private_elements() {
    return this.elementService.get_private_elements();
  }

  updateElementsDataFromSource() {
    const subscription = this.elementService.elementsFetcher().subscribe({
      next: (response) => {
        if (!this.dataSource().data || this.dataSource().data.length === 0) {
          this.dataSource.set(new MatTableDataSource(this.elementData()));
        } else {
          this.dataSource().data = response.elementData;
        }
      },
      error: (error: Error) => {
        console.log(error);
        //   this.error.set(error.message);
      },
      complete: () => {
        console.log('complete');
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
