import { Request, Response, NextFunction } from 'express';
import ExpenseRepoService from '../services/expenseRepoService';
import { AppDataSource } from "../data-source";
// import { items, Item } from '../models/item';

const expenseRepoService: ExpenseRepoService = new ExpenseRepoService();

// Read all items
export const getExpenses = async (req: Request, res: Response, next: NextFunction) => {
  try {
	let expenseData = await expenseRepoService.getAllExpenseDetails();
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