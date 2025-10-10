import { AppDataSource } from "../data-source";
// import { v_expense_detail } from "../entity/v_expense_detail_old";
import { v_expense_detail } from "../entity/v_expense_details"
import { v_expense } from "../entity/v_expense";
import { v_expense_type } from "../entity/v_expense_type";
import { v_payment_type_category } from "../entity/v_payment_type_category";

export default class ExpenseRepoService {
  private vExpenseDetail = AppDataSource.getRepository(v_expense_detail);
  private vExpense = AppDataSource.getRepository(v_expense);
  private vExpenseType = AppDataSource.getRepository(v_expense_type);
  private vPaymentTypeCategory = AppDataSource.getRepository(
    v_payment_type_category
  );

  public async getAllExpenseDetails() {
    const expenses = await this.vExpenseDetail.find();
    return expenses;
  }

  public async getExpenseDetailsById(expenseID: number) {
    const expenses = await this.vExpenseDetail.findBy({ ExpenseID: expenseID });
    return expenses;
  }

  public async getExpenses() {
    const expenses = await this.vExpense.find();
  }

  public async getExpenseById(expenseID: number) {
    const expenses = await this.vExpense.findBy({ ExpenseID: expenseID });
    return expenses;
  }

  public async getExpenseTypes() {
    const expenses = await this.vExpenseType.find();
  }

  public async getExpenseTypeById(expenseTypeID: number) {
    const expenses = await this.vExpenseType.findBy({
      ExpenseTypeID: expenseTypeID,
    });
    return expenses;
  }

  public async getPaymentTypeCategory() {
    const expenses = await this.vPaymentTypeCategory.find();
  }

  public async getPaymentTypeCategoryById(paymentTypeCategoryID: number) {
    const expenses = await this.vPaymentTypeCategory.findBy({
      PaymentTypeCategoryID: paymentTypeCategoryID,
    });
    return expenses;
  }
}
