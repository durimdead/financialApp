import { AppDataSource } from "../data-source";
import { v_expense_details } from "../entity/v_expense_details"

export default class ExpenseRepoService {
  private vExpenseDetail = AppDataSource.getRepository(v_expense_details);

  getAllExpenseDetails() {
    return this.vExpenseDetail.find();
  }

  getExpenseDetailsById(expenseId: number){
	return this.vExpenseDetail.findBy({ExpenseID: expenseId});
  }

}
