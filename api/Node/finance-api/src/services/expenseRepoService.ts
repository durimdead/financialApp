import { AppDataSource } from "../data-source";
// import { v_expense_detail } from "../entity/v_expense_detail_old";
import { v_expense_detail } from "../entity/v_expense_details"
import { v_expense } from "../entity/v_expense";
import { v_expense_type } from "../entity/v_expense_type";
import { v_payment_type_category } from "../entity/v_payment_type_category";
import { v_payment_type } from "../entity/v_payment_type";

export default class ExpenseRepoService {
  private vExpenseDetail = AppDataSource.getRepository(v_expense_detail);
  private vExpense = AppDataSource.getRepository(v_expense);
  private vExpenseType = AppDataSource.getRepository(v_expense_type);
  private vPaymentType = AppDataSource.getRepository(v_payment_type);
  private vPaymentTypeCategory = AppDataSource.getRepository(
    v_payment_type_category
  );

  /**
   *	Gets all expenses with their full details
   *	@returns - List of all expenses with all details
   */
  public async getAllExpenseDetails() {
    const expenses = await this.vExpenseDetail.find();
    return expenses;
  }

  /**
   *	Gets expense with full details based on ID
   *	@param expenseID - The ID of the expense to get details for
   *	@returns - List of all expenses with all details
   */
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

  public async getPaymentType() {
    const expenses = await this.vPaymentType.find();
  }

  public async getPaymentTypeById(paymentTypeID: number) {
    const expenses = await this.vPaymentType.findBy({
      PaymentTypeID: paymentTypeID,
    });
    return expenses;
  }
}
