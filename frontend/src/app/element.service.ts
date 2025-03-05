import { Injectable } from '@angular/core';
import { PeriodicElement, PeriodicElementCrudData } from '../app.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ElementService {
  private ELEMENT_DATA: PeriodicElement[] = [
    {
      actions: '',
      elementId: 1,
      name: 'Hydrogen',
      weight: 1.0079,
      symbol: 'H',
    },
    { actions: '', elementId: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { actions: '', elementId: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    {
      actions: '',
      elementId: 4,
      name: 'Beryllium',
      weight: 9.0122,
      symbol: 'Be',
    },
    { actions: '', elementId: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { actions: '', elementId: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    {
      actions: '',
      elementId: 7,
      name: 'Nitrogen',
      weight: 14.0067,
      symbol: 'N',
    },
    { actions: '', elementId: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    {
      actions: '',
      elementId: 9,
      name: 'Fluorine',
      weight: 18.9984,
      symbol: 'F',
    },
    { actions: '', elementId: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ];

  readonly crudStates = {
    create: 'add',
    read: 'read',
    update: 'edit',
    delete: 'delete',
  };

  getElements() {
    return this.ELEMENT_DATA;
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
    if (actionToTake === this.crudStates.read || actionToTake === this.crudStates.delete || actionToTake === this.crudStates.update) {
      	returnValue.elementData = this.getElementById(elementId);
	}
	else if (actionToTake !== this.crudStates.create){
		throw "Invalid Parameter: actionToTake"
	}
	return returnValue;
  }

  getElementById(elementId: number){
	return this.ELEMENT_DATA.find((item) => item.elementId === elementId) as PeriodicElement;
  }

  // add element provided it is not already in the list AND it has a valid elementId
  addElement(elementToAdd: PeriodicElement) {
    let isDuplicate =
      this.ELEMENT_DATA.find(
        (element) => element.elementId === elementToAdd.elementId
      ) !== undefined;

    // this is either a duplicate or does not have an Id, so we need a unique Id to add the element
    if (elementToAdd.elementId < 1 || isDuplicate) {
      elementToAdd.elementId = this.getNextElementId();
    }
    this.ELEMENT_DATA.push(elementToAdd);
  }

  // ensures we get a unique Id for adding another element
  getNextElementId() {
    const elementIds = this.getElements().map((element) => element.elementId);
    return Math.max(...elementIds) + 1;
  }

  // "delete" the element from the table of data
  deleteElement(elementId: number) {
    this.ELEMENT_DATA = this.ELEMENT_DATA.filter(
      (itemToDelete) => itemToDelete.elementId !== elementId
    );
  }

  // determines if any data for this elementId exists in the ELEMENT_DATA array
  elementDataExists(elementId: number) {
    return this.ELEMENT_DATA.find((element) => element.elementId === elementId)
      ? true
      : false;
  }

  // update the data for the edited element in the ELEMENT_DATA array
  updateElement(elementToUpdate: PeriodicElement) {
    try {
      //get current data for element we are trying to update
      let currentElementDataIndex = this.ELEMENT_DATA.findIndex(
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
          this.ELEMENT_DATA[currentElementDataIndex].weight +
          "'."
        );
      }

      // update with new element data
      this.ELEMENT_DATA[currentElementDataIndex] = elementToUpdate;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  // ensures that the source of data is completely up to date. We should not need this once we switch to a database
  updateDataSource(elementArray: PeriodicElement[]): PeriodicElement[] {
    this.ELEMENT_DATA = elementArray;
    return this.getElements();
  }

  constructor() {}

  // not the best place for this, but it was a better option than continuing to hide it inside the individual typescript classes
  //TODO: extract out to better location.
  isNotANumber(valueToCheck: string): boolean {
    return Number.isNaN(Number(valueToCheck));
  }
}
