import { AppDataSource } from "../data-source";
// import { v_expense_detail } from "../entity/v_expense_detail_old";
import { v_expense_detail } from "../entity/v_expense_details"
import { v_expense } from "../entity/v_expense";

export default class ExpenseRepoService {
  private vExpenseDetail = AppDataSource.getRepository(v_expense_detail);
  private vExpense = AppDataSource.getRepository(v_expense);

  public async getAllExpenseDetails() {
    const expenses = await this.vExpenseDetail.find();
    return expenses;
  }

  public async getExpenseDetailsById(expenseId: number) {
    const expenses = await this.vExpenseDetail.findBy({ ExpenseID: expenseId });
    return expenses;
  }

  public async getExpenses() {
    const expenses = await this.vExpense.find();
  }

  public async getExpenseById(expenseId: number) {
    const expenses = await this.vExpense.findBy({ ExpenseID: expenseId });
    return expenses;
  }
}
