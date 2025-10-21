import { Request, Response, NextFunction } from "express";
import ExpenseRepoService from "../services/expenseRepoService";

const expenseRepoService: ExpenseRepoService = new ExpenseRepoService();

export const getExpenseTypes = async (req: Request, res: Response, next: NextFunction) => {
	try{
		let expenseTypeData = await expenseRepoService.getAllExpenseTypes();
		let returnValue = {
			httpStatusCode: 200,
			expenseData: expenseTypeData,
			errorMessage: "",
		};
		res.json(returnValue);
	} catch (error) {
		next(error);
	}
}