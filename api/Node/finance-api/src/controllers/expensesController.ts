import { Request, Response, NextFunction } from 'express';
import ExpenseRepoService from '../services/expenseRepoService';
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

export const putExpenses = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const expenseDetails = req.body;
		console.log(expenseDetails);
		// const result = await expenseRepoService.upsertExpense(0, 1, 1, 1, "testing sproc call", false, false, new Date(), 100.00);
		res.json({ "httpStatusCode": 200, "errorMessage": "" });
	}
	catch(error){
		next(error);
	}
}