import { Response, Request, NextFunction } from "express";
import ExpenseRepoService from "../services/expenseRepoService";

const expenseRepoService: ExpenseRepoService = new ExpenseRepoService();

export const getPaymentTypes = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const paymentTypeData = await expenseRepoService.getAllPaymentTypes();
		const returnValue = {
			httpStatusCode: 200,
			paymentTypeData: paymentTypeData,
			errorMessage: "",
		}; 
		res.json(returnValue);
	} catch (error) {
		next(error);
	}
}

export const getPaymentTypesBySearchString = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const searchString = req.query.paymentTypeSearchString?.toString() ?? "";
		const paymentTypeData = await expenseRepoService.getPaymentTypesByPartialName_SearchString(searchString);
		const returnValue = {
			httpStatusCode: 200,
			paymentTypeData: paymentTypeData,
			errorMessage: "",
		}; 
		res.json(returnValue);
	} catch (error) {
		next(error);
	}
}