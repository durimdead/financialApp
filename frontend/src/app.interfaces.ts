// #region Common
//------------------------
//------------------------
export const CRUD_STATES = {
  create: 'add',
  read: 'read',
  update: 'edit',
  delete: 'delete',
};

export type CrudState = 'add' | 'read' | 'edit' | 'delete';
//------------------------
//------------------------
// #endregion Common

// #region Expenses
//------------------------
//------------------------
export interface Expense {
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

export interface ExpenseCrudData {
	expenseState: CrudState;
	expenseData: Expense;
}
//------------------------
//------------------------
// #endregion Expenses

// #region POC_Test
//------------------------
//------------------------
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
//------------------------
//------------------------
// #endregion POC_Test
