import { Request, Response, NextFunction } from 'express';
import ExpenseRepoService from '../services/expenseRepoService';
// import { items, Item } from '../models/item';

const expenseRepoService: ExpenseRepoService = new ExpenseRepoService();

// Read all items
export const getExpenses = (req: Request, res: Response, next: NextFunction) => {
  try {
	let expenseData = expenseRepoService.getSampleExpenseData();
	let returnValue = {
    httpStatusCode: 200,
    expenseData: expenseData,
    errorMessage: "",
  };
    res.json(returnValue);
  } catch (error) {
    next(error);
  }
};