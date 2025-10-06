import { Request, Response, NextFunction } from 'express';
// import { items, Item } from '../models/item';

// Read all items
export const getExpenses = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      httpStatusCode: 200,
      expenseData: [
        {
          expenseID: 1,
          expenseTypeName: "other",
          paymentTypeName: "cash",
          paymentTypeCategoryName: "cash",
          isIncome: false,
          isInvestment: false,
          expenseTypeID: 1,
          paymentTypeID: 1,
          paymentTypeDescription:
            "hard currency physically changing hands (i.e. not a cash app)",
          paymentTypeCategoryID: 1,
          expenseDate: "2025-10-03T00:00:00",
          lastUpdated: "0001-01-01T00:00:00",
          expenseDescription: "sample hard cash transation",
          expenseAmount: 100,
        },
        {
          expenseID: 2,
          expenseTypeName: "other",
          paymentTypeName: "cash app",
          paymentTypeCategoryName: "cash",
          isIncome: false,
          isInvestment: false,
          expenseTypeID: 1,
          paymentTypeID: 2,
          paymentTypeDescription:
            "virtual currency changing hands (i.e. paypal, venmo, zelle, etc.)",
          paymentTypeCategoryID: 1,
          expenseDate: "2025-10-03T00:00:00",
          lastUpdated: "0001-01-01T00:00:00",
          expenseDescription: "sample cash app transation",
          expenseAmount: 234.01,
        },
        {
          expenseID: 4,
          expenseTypeName: "other",
          paymentTypeName: "cash app",
          paymentTypeCategoryName: "cash",
          isIncome: false,
          isInvestment: false,
          expenseTypeID: 1,
          paymentTypeID: 2,
          paymentTypeDescription:
            "virtual currency changing hands (i.e. paypal, venmo, zelle, etc.)",
          paymentTypeCategoryID: 1,
          expenseDate: "2025-10-03T00:00:00",
          lastUpdated: "0001-01-01T00:00:00",
          expenseDescription: "another new test expense",
          expenseAmount: 100.02,
        },
      ],
      errorMessage: "",
    });
  } catch (error) {
    next(error);
  }
};