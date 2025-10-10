import { AppDataSource } from "../data-source";
// import { v_expense_detail } from "../entity/v_expense_detail_old";
import { v_expense_detail } from "../entity/v_expense_details"
import { v_expenses } from "../entity/v_expenses";

export default class ExpenseRepoService {
	private vExpenseDetail = AppDataSource.getRepository(v_expense_detail);

	public async getAllExpenseDetails() {
		const expenses = await this.vExpenseDetail.find();
		return expenses;
	}

	public async getExpenseDetailsById(expenseId: number){
		const expenses = await this.vExpenseDetail.findBy({ExpenseID: expenseId});
		return expenses;
	}
}
