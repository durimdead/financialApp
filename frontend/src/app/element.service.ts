import { DestroyRef, inject, Injectable, OnInit, signal } from '@angular/core';
import {
  ElementApiGet,
  PeriodicElement,
  PeriodicElementCrudData,
} from '../app.interfaces';
import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http';
import { catchError, lastValueFrom, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ElementService {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private elementData = signal<PeriodicElement[]>([]);
  private ApiUrlBase: string = 'https://localhost:7107/';
  private urlElements: string = this.ApiUrlBase + 'api/PeriodicElements/';

  ELEMENT_DATA = this.elementData.asReadonly();

  readonly crudStates = {
    create: 'add',
    read: 'read',
    update: 'edit',
    delete: 'delete',
  };

  elementsFetcher() {
    return this.httpFetchElements(
      this.urlElements,
      'Error getting Elements'
    ).pipe(
      tap({
        next: (results) => {
          if (results.httpStatusCode === 200) {
            console.log('tap - next - 200');
            this.elementData.set(results.elementData);
          } else if (results.httpStatusCode >= 500) {
            console.log('tap - next - not 200');
            console.log(results.errorMessage);
          }
        },
      })
    );
  }

  private httpFetchElements(fetchElementsUrl: string, errorMessage: string) {
    return this.httpClient.get<{
      httpStatusCode: number;
      elementData: PeriodicElement[];
      errorMessage: string;
    }>(fetchElementsUrl);
  }

  private httpUpdateElement(elementToUpdate: PeriodicElement) {
    const elementParam = JSON.stringify(elementToUpdate);
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      }),
    };
    return this.httpClient.put<{
      httpStatusCode: number;
      errorMessage: string;
    }>(this.urlElements, elementParam, headers);
  }

  private httpDeleteElement(elementId: number) {
    console.log('about to call api for deleteElement');
    return this.httpClient.delete<{
      httpStatusCode: number;
      errorMessage: string;
    }>(this.urlElements + elementId);
  }

  private httpAddElement(elementToAdd: PeriodicElement) {
    const elementParam = JSON.stringify(elementToAdd);
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      }),
    };
    return this.httpClient.post<{
      httpStatusCode: number;
      errorMessage: string;
    }>(this.urlElements, elementParam, headers);
  }

  getElementDataForCrudModal(elementId: number, actionToTake: string) {
    let elementData: PeriodicElement = {
      actions: '',
      name: '',
      elementId: elementId,
      weight: 0,
      symbol: '',
    };
    let returnValue: PeriodicElementCrudData = {
      elementState: actionToTake,
      elementData: elementData,
    };
    if (
      actionToTake === this.crudStates.read ||
      actionToTake === this.crudStates.delete ||
      actionToTake === this.crudStates.update
    ) {
      returnValue.elementData = this.getElementById(elementId);
    } else if (actionToTake !== this.crudStates.create) {
      throw 'Invalid Parameter: actionToTake';
    }
    return returnValue;
  }

  getElementById(elementId: number) {
    return this.elementData().find(
      (item) => item.elementId === elementId
    ) as PeriodicElement;
  }

  // add element provided it is not already in the list AND it has a valid elementId
  addElement(elementToAdd: PeriodicElement) {
    let isDuplicate =
      this.elementData().find(
        (element) => element.elementId === elementToAdd.elementId
      ) !== undefined;

    // this is either a duplicate or does not have an Id, so we need a unique Id to add the element
    //TODO: move this to the API controller to have the elementId come from the server side
    if (elementToAdd.elementId < 1 || isDuplicate) {
      elementToAdd.elementId = this.getNextElementId();
    }

    try {
      // cannot save the data if the element is not valid.
      if (Number.isNaN(Number(elementToAdd.weight))) {
        throw (
          "Element weight must be a number. Current value: '" +
          elementToAdd.weight +
          "'."
        );
      } else if (elementToAdd.name.length < 3) {
        throw (
          'Element name must have a length of at least 3. Element Name = ' +
          elementToAdd.name
        );
      } else if (elementToAdd.symbol === '') {
        throw (
          "Element Symbol must have a value. Element Symbol = '" +
          elementToAdd.symbol +
          "'."
        );
      } else if (this.elementDataExists(elementToAdd.elementId)) {
        throw (
          "ElementId already exists: ElementId = '" +
          elementToAdd.elementId +
          "'."
        );
      }

      // posts the element to update and updates the datasource appropriately if we don't get an error back.
      return this.httpAddElement(elementToAdd).pipe(
        tap({
          next: (results) => {
            if (results.httpStatusCode === 200) {
              console.log('POST - addElement - tap - 200 response');
              this.elementData().push(elementToAdd);
            } else {
              console.log('POST - addElement - tap - NOT 200 response');
            }
          },
        })
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  // ensures we get a unique Id for adding another element
  getNextElementId() {
    const elementIds = this.elementData().map((element) => element.elementId);
    return Math.max(...elementIds) + 1;
  }

  // "delete" the element from the table of data
  deleteElement(elementId: number) {
    console.log('about to call httpDeleteElement()');
    return this.httpDeleteElement(elementId).pipe(
      tap({
        next: (results) => {
          if (results.httpStatusCode === 200) {
            console.log('DELETE - elementUpdate - tap - 200 response');
            this.elementData.set(
              this.elementData().filter(
                (itemToDelete) => itemToDelete.elementId !== elementId
              )
            );
          } else {
            console.log('DELETE - elementUpdate - tap - NOT 200 response');
          }
        },
      })
    );
  }

  // determines if any data for this elementId exists in the elementData array
  elementDataExists(elementId: number) {
    return this.elementData().find((element) => element.elementId === elementId)
      ? true
      : false;
  }

  // update the data for the edited element in the elementData array
  updateElement(elementToUpdate: PeriodicElement) {
    try {
      //get current data for element we are trying to update
      let currentElementDataIndex = this.elementData().findIndex(
        (item) => item.elementId === elementToUpdate.elementId
      );

      if (Number.isNaN(Number(elementToUpdate.weight))) {
        throw (
          "Element weight must be a number. Current value: '" +
          elementToUpdate.weight +
          "'."
        );
      } else if (elementToUpdate.name.length < 3) {
        throw (
          'Element name must have a length of at least 3. Element Name = ' +
          elementToUpdate.name
        );
      } else if (elementToUpdate.symbol === '') {
        throw (
          "Element Symbol must have a value. Element Symbol = '" +
          elementToUpdate.symbol +
          "'."
        );
      } else if (!this.elementDataExists(elementToUpdate.elementId)) {
        throw (
          "ElementId does not exist, but must to edit a periodic element: ElementId = '" +
          elementToUpdate.elementId +
          "'."
        );
      }

      // cannot save the data if the element weight isn't numeric.
      if (
        Number.isNaN(Number(elementToUpdate.weight)) ||
        elementToUpdate.name.length < 3 ||
        elementToUpdate.symbol === '' ||
        !this.elementDataExists(elementToUpdate.elementId)
      ) {
        throw (
          "Element weight must be a number. Current value: '" +
          elementToUpdate.weight +
          "'. Previous value: '" +
          this.elementData()[currentElementDataIndex].weight +
          "'."
        );
      }

      // posts the element to update and updates the datasource appropriately if we don't get an error back.
      return this.httpUpdateElement(elementToUpdate).pipe(
        tap({
          next: (results) => {
            if (results.httpStatusCode === 200) {
              console.log('POST - elementUpdate - tap - 200 response');
              this.elementData()[currentElementDataIndex] = elementToUpdate;
            } else {
              console.log('POST - elementUpdate - tap - NOT 200 response');
            }
          },
        })
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  // not the best place for this, but it was a better option than continuing to hide it inside the individual typescript classes
  //TODO: extract out to better location.
  isNotANumber(valueToCheck: string): boolean {
    return Number.isNaN(Number(valueToCheck));
  }

  get_private_elements() {
    return this.elementData();
  }
}
