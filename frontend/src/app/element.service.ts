import { Injectable } from '@angular/core';
import { PeriodicElement } from '../app.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ElementService {
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

  getElements(){
    return this.ELEMENT_DATA;
  }

  // add element provided it is not already in the list AND it has a valid elementId
  addElement(elementToAdd: PeriodicElement){
    let isDuplicate = (this.ELEMENT_DATA.find(element => element.elementId === elementToAdd.elementId) !== undefined);
    if (elementToAdd.elementId > 0 && !isDuplicate){
      this.ELEMENT_DATA.push(elementToAdd);
    }
    else{
      elementToAdd.elementId = this.getNextElementId();
      this.ELEMENT_DATA.push(elementToAdd);
    }
  }

  // ensures we get a unique Id for adding another element
  getNextElementId(){
    const elementIds = this.getElements().map(element => element.elementId);
    return Math.max(...elementIds) + 1;
  }

  // "delete" the element from the table of data
  deleteElement(elementId: number){
    this.ELEMENT_DATA = this.ELEMENT_DATA.filter(itemToDelete => itemToDelete.elementId !== elementId);
  }

  updateDataSource(elementArray: PeriodicElement[]): PeriodicElement[]{
    this.ELEMENT_DATA = elementArray;
    return this.getElements();
  }

  constructor() { }
  
  // not the best place for this, but it was a better option than continuing to hide it inside the individual typescript classes
  //TODO: extract out to better location.
  isNotANumber(valueToCheck: string): boolean{
    return Number.isNaN(Number(valueToCheck));
  }
}
