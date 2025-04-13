//#region "Expenses"
export interface ExpenseData {
  //TODO: see if we can remove this item
  actions: string;
  ExpenseID: number;
  ExpenseTypeID: number;
  PaymentTypeID: number;
  PaymentTypeCategoryID: number;
  ExpenseTypeName: string;
  PaymentTypeName: string;
  PaymentTypeDescription: string;
  PaymentTypeCategoryName: string;
  IsIncome: boolean;
  IsInvestment: boolean;
  ExpenseDescription: string;
  ExpenseAmount: 0;
  ExpenseDate: Date;
  LastUpdated: Date;
}
//#endRegion "Expenses"

//#region "POC_Test"
export interface PeriodicElement {
  actions: string;
  elementName: string;
  elementId: number;
  elementWeight: number;
  elementSymbol: string;
}

export interface PeriodicElementCrudData {
  elementState: string;
  elementData: PeriodicElement;
}

export interface ElementApiGet {
  httpStatusCode: number;
  elementData: PeriodicElement[];
  errorMessage: string;
}
//#endRegion "POC_Test"
