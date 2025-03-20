export interface PeriodicElement {
    actions: string;
    elementName: string;
    elementId: number;
    elementWeight: number;
    elementSymbol: string;
}

export interface PeriodicElementCrudData{
	elementState: string;
	elementData: PeriodicElement;
}

export interface ElementApiGet {
  httpStatusCode: number;
  elementData: PeriodicElement[];
  errorMessage: string;
}