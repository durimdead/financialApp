import { Request, Response, NextFunction } from "express";
import ExpenseRepoService from "../services/expenseRepoService";

const expenseRepoService: ExpenseRepoService = new ExpenseRepoService();

/**
 * Gets all expense types in the database as an array
 * @param req the request object sent in - no special input data required here
 * @param res sends back {httpStatusCode: number, expenseTypeData: [], errorMessage: string}
 * @param next used for error handling
 */
export const getExpenseTypes = async (req: Request, res: Response, next: NextFunction) => {
	try{
		let expenseTypeData = await expenseRepoService.getAllExpenseTypes();
		let returnValue = {
			httpStatusCode: 200,
			expenseTypeData: expenseTypeData,
			errorMessage: "",
		};
		res.json(returnValue);
	} catch (error) {
		next(error);
	}
}

/**
 * Gets all expense types based on a search string (performs a partial search). This string is sent in as a url param ("" by default if not found, which will return all results)
 * @param req the request object sent in - no special input data required here
 * @param res sends back {httpStatusCode: number, expenseTypeData: [], errorMessage: string}
 * @param next used for error handling
 */
export const getExpenseTypesBySearchString = async (req: Request, res: Response, next: NextFunction) => {
	try{
		const searchString = req.query.expenseTypeSearchString?.toString() ?? "";
		let expenseTypeData = await expenseRepoService.getExpenseTypesByPartialName_SearchString(searchString!);
		let returnValue = {
			httpStatusCode: 200,
			expenseTypeData: expenseTypeData,
			errorMessage: "",
		};
		res.json(returnValue);
	} catch (error) {
		next(error);
	}
}