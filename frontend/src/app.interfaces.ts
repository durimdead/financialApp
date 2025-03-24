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

export interface ExpenseData {
	//TODO: see if we can remove this item
	actions: string;
	expenseId: number;
	expenseDate: Date;
	expenseDescription: string;
	expenseAmount: number;
	//TODO: update to be an actual enum-ish type
	expenseType: string;
	//TODO: update to be an actual enum-ish type
	expensePaymentType: string;
	//TODO: also an enum-ish type??
	expensePaymentDescription: string;
}

