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
  private financeAppDB = AppDataSource;

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
   *	@param expenseID The ID of the expense to get details for
   *	@returns List of all expenses with all details
   */
  public async getExpenseDetailsById(expenseID: number) {
    const expense = await this.vExpenseDetail.findBy({ expenseID: expenseID });
    return expense;
  }

  /**
   * Get a list of the base information on all expenses
   * @returns a list of all expenses with base information on them.
   */
  public async getExpenses() {
    const expenses = await this.vExpense.find();
	return expenses
  }

  /**
   * Get a list of the base information an expense based on expenseID
   * @param expenseID The ID of the expense to get information for
   * @returns A single expense object
   */
  public async getExpenseById(expenseID: number) {
    const expense = await this.vExpense.findBy({ expenseID: expenseID });
    return expense;
  }

  /**
   * Get a list of all Expense Types
   * @return A list of all Expense Types
   */
  public async getExpenseTypes() {
    const expenseTypes = await this.vExpenseType.find();
	return expenseTypes;
  }

  /**
   * Get a single expense type by expenseTypeID
   * @param expenseTypeID The ID of the Expense Type to get
   * @returns A single Expense Type
   */
  public async getExpenseTypeById(expenseTypeID: number) {
    const expenseType = await this.vExpenseType.findBy({
      expenseTypeID: expenseTypeID,
    });
    return expenseType;
  }

  /**
   * Get a list of all Payment Type Categories
   * @returns A list of all Payment Type Categories
   */
  public async getPaymentTypeCategories() {
    const paymentTypeCategories = await this.vPaymentTypeCategory.find();
	return paymentTypeCategories;
  }

  /**
   * Get a single PaymentTypeCategory based on paymentTypeCategoryID
   * @param paymentTypeCategoryID ID of the Payment Type Category to get
   * @returns A single Payment Type Category
   */
  public async getPaymentTypeCategoryById(paymentTypeCategoryID: number) {
    const paymentTypeCategory = await this.vPaymentTypeCategory.findBy({
      paymentTypeCategoryID: paymentTypeCategoryID,
    });
    return paymentTypeCategory;
  }

  /**
   * Get all Payment Types
   * @returns A list of Payment Types
   */
  public async getPaymentTypes() {
    const paymentTypes = await this.vPaymentType.find();
	return paymentTypes;
  }

  /**
   * Get a single Payment Type based on paymentTypeID
   * @param paymentTypeID ID of the Payment Type to get
   * @returns A single Payment Type
   */
  public async getPaymentTypeById(paymentTypeID: number) {
    const paymentType = await this.vPaymentType.findBy({
      paymentTypeID: paymentTypeID,
    });
    return paymentType;
  }

  
  public async upsertExpense(expenseID: number, expenseTypeID: number, paymentTypeID: number, paymentTypeCategoryID: number, expenseDescription: string, isIncome: boolean, isInvestment: boolean, expenseDate: Date, expenseAmount: number){
    try{
		const result = await this.financeAppDB.query(
      "CALL proc_expense_upsert($1, $2, $3, $4, $5, $6::BOOLEAN, $7::BOOLEAN, $8::DATE, $9)", // Pass NULL for OUT parameters to receive results
      [expenseID, expenseTypeID, paymentTypeID, paymentTypeCategoryID, expenseDescription, isIncome, isInvestment, expenseDate, expenseAmount]
    );
	}
	catch (e){
		console.log(e);
	}
  }
}
