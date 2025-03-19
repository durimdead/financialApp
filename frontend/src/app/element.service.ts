import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import {
  PeriodicElement,
  PeriodicElementCrudData,
} from '../app.interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';

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
            this.elementData.set(results.elementData);
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
      } else if (elementToAdd.symbol === '' && elementToAdd.symbol.length <= 3) {
        throw (
          "Element Symbol must have a value and be less than 3 characters long. Element Symbol = '" +
          elementToAdd.symbol +
          "'."
        );
      }

      // posts the element to update and updates the datasource appropriately if we don't get an error back.
      return this.httpAddElement(elementToAdd);
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
    return this.httpDeleteElement(elementId);
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
      } else if (elementToUpdate.symbol === '' && elementToUpdate.symbol.length <= 3) {
        throw (
          "Element Symbol must have a value and be no more then 3 characters long. Element Symbol = '" +
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
      return this.httpUpdateElement(elementToUpdate);
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
