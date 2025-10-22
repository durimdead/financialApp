import { Response, Request, NextFunction } from "express";
import ExpenseRepoService from "../services/expenseRepoService";

const expenseRepoService: ExpenseRepoService = new ExpenseRepoService();

export const getPaymentTypes = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const paymentTypesData = await expenseRepoService.getAllPaymentTypes();
		const returnValue = {
			httpStatusCode: 200,
			expenseTypeData: paymentTypesData,
			errorMessage: "",
		}; 
		res.json(returnValue);
	} catch (error) {
		next(error);
	}
}