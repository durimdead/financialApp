export interface PeriodicElement {
    actions: string;
    name: string;
    elementId: number;
    weight: number;
    symbol: string;
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