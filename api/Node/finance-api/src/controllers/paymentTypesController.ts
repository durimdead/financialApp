import { Response, Request, NextFunction } from "express";
import ExpenseRepoService from "../services/expenseRepoService";

const expenseRepoService: ExpenseRepoService = new ExpenseRepoService();

/**
 * Gets all payment types in the database as an array
 * @param req the request object sent in - no special input data required here
 * @param res sends back {httpStatusCode: number, paymentTypeData: [], errorMessage: string}
 * @param next used for error handling
 */
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

/**
 * Gets all payment types based on a search string (performs a partial search). This string is sent in as a url param ("" by default if not found, which will return all results)
 * @param req the request object sent in - no special input data required here
 * @param res sends back {httpStatusCode: number, paymentTypeData: [], errorMessage: string}
 * @param next used for error handling
 */
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