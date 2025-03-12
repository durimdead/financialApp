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
    return this.fetchElements(this.urlElements, 'Error getting Elements').pipe(
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

  private fetchElements(fetchElementsUrl: string, errorMessage: string) {
    return this.httpClient.get<{
      httpStatusCode: number;
      elementData: PeriodicElement[];
      errorMessage: string;
    }>(fetchElementsUrl);
  }

  postElementUpdate(elementToUpdate: PeriodicElement) {
    const elementParam = JSON.stringify(elementToUpdate);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });
    return this.httpClient.post<{
      httpStatusCode: number;
      errorMessage: string;
    }>(this.urlElements, JSON.stringify(elementToUpdate), {headers: headers});
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
    if (elementToAdd.elementId < 1 || isDuplicate) {
      elementToAdd.elementId = this.getNextElementId();
    }
    this.elementData().push(elementToAdd);
  }

  // ensures we get a unique Id for adding another element
  getNextElementId() {
    const elementIds = this.elementData().map((element) => element.elementId);
    return Math.max(...elementIds) + 1;
  }

  // "delete" the element from the table of data
  deleteElement(elementId: number) {
    this.elementData.set(
      this.elementData().filter(
        (itemToDelete) => itemToDelete.elementId !== elementId
      )
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
      return this.postElementUpdate(elementToUpdate).pipe(
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
