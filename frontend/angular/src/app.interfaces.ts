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
  expenseID: number;
  expenseTypeID: number;
  paymentTypeID: number;
  paymentTypeCategoryID: number;
  expenseTypeName: string;
  paymentTypeName: string;
  paymentTypeDescription: string;
  paymentTypeCategoryName: string;
  isIncome: boolean;
  isInvestment: boolean;
  expenseDescription: string;
  expenseAmount: number;
  expenseDate: Date;
  lastUpdated: Date;
}

export interface ExpenseType {
	expenseTypeID: number;
	expenseTypeName: string;
	expenseTypeDescription: string;
}

export interface PaymentType{
	paymentTypeID: number,
    paymentTypeCategoryID: number,
    paymentTypeName: string,
    paymentTypeDescription: string
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
  elementName: string;
  elementID: number;
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
