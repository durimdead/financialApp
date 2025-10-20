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

export const postExpenses = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const expenseDetails = req.body;
		console.log('post expenses');
		const result = await expenseRepoService.upsertExpense(
			expenseDetails.expenseID,
			expenseDetails.expenseTypeID,
			expenseDetails.paymentTypeID,
			expenseDetails.paymentTypeCategoryID,
			expenseDetails.expenseDescription,
			expenseDetails.isIncome,
			expenseDetails.isInvestment,
			expenseDetails.expenseDate,
			expenseDetails.expenseAmount
		);
		res.json({ "httpStatusCode": 200, "errorMessage": "" });
	}
	catch(error){
		next(error);
	}
}

export const putExpenses = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const expenseDetails = req.body;
		const result = await expenseRepoService.upsertExpense(
			expenseDetails.expenseID,
			expenseDetails.expenseTypeID,
			expenseDetails.paymentTypeID,
			expenseDetails.paymentTypeCategoryID,
			expenseDetails.expenseDescription,
			expenseDetails.isIncome,
			expenseDetails.isInvestment,
			expenseDetails.expenseDate,
			expenseDetails.expenseAmount
		);
		res.json({ "httpStatusCode": 200, "errorMessage": "" });
	}
	catch(error){
		next(error);
	}
}