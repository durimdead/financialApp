import { Request, Response, NextFunction } from 'express';
import ExpenseRepoService from '../services/expenseRepoService';

const expenseRepoService: ExpenseRepoService = new ExpenseRepoService();

/**
 * Gets all expenses in the database with their full details
 * @param req the request object sent in - no special input data required here
 * @param res sends back {httpStatusCode:number, expenseData:[], errorMessage: string}
 * @param next used for error handling
 */
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

/**
 * To add a new Expense to the database. Information required is sent in through the request object as a json object in the body
 * @param req req.body requires {expenseTypeID: number, paymentTypeID: number, paymentTypeCategoryID: number, expenseDescription: string, isIncome: boolean, isInvestment: boolean, expenseDate: Date, expenseAmount: decimal
 * @param res sends back {httpStatusCode:number, errorMessage: string}
 * @param next used for error handling
 */
export const postExpenses = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const expenseDetails = req.body;
		const result = await expenseRepoService.upsertExpense(
			0, // expenseID - 0 indicates it is a new expense being added
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

/**
 * To update an Expense in the database. Information required is sent in through the request object as a json object in the body
 * @param req req.body requires {expenseID: number, expenseTypeID: number, paymentTypeID: number, paymentTypeCategoryID: number, expenseDescription: string, isIncome: boolean, isInvestment: boolean, expenseDate: Date, expenseAmount: decimal
 * @param res sends back {httpStatusCode:number, errorMessage: string}
 * @param next used for error handling
 */
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