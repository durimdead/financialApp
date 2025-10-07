import { AppDataSource } from "../data-source";
import { v_expense_details } from "../entity/v_expense_details"

export default class ExpenseRepoService {
  private vExpenseDetail = AppDataSource.getRepository(v_expense_details);

  getAllExpenseDetails() {
    return this.vExpenseDetail.find();
  }

  getSampleExpenseData() {
    let expenseDataArray = [
      {
        expenseID: 1,
        expenseTypeName: "other",
        paymentTypeName: "cash",
        paymentTypeCategoryName: "cash",
        isIncome: false,
        isInvestment: false,
        expenseTypeID: 1,
        paymentTypeID: 1,
        paymentTypeDescription:
          "hard currency physically changing hands (i.e. not a cash app)",
        paymentTypeCategoryID: 1,
        expenseDate: "2025-10-03T00:00:00",
        lastUpdated: "0001-01-01T00:00:00",
        expenseDescription: "sample hard cash transation",
        expenseAmount: 100,
      },
      {
        expenseID: 2,
        expenseTypeName: "other",
        paymentTypeName: "cash app",
        paymentTypeCategoryName: "cash",
        isIncome: false,
        isInvestment: false,
        expenseTypeID: 1,
        paymentTypeID: 2,
        paymentTypeDescription:
          "virtual currency changing hands (i.e. paypal, venmo, zelle, etc.)",
        paymentTypeCategoryID: 1,
        expenseDate: "2025-10-03T00:00:00",
        lastUpdated: "0001-01-01T00:00:00",
        expenseDescription: "sample cash app transation",
        expenseAmount: 234.01,
      },
      {
        expenseID: 4,
        expenseTypeName: "other",
        paymentTypeName: "cash app",
        paymentTypeCategoryName: "cash",
        isIncome: false,
        isInvestment: false,
        expenseTypeID: 1,
        paymentTypeID: 2,
        paymentTypeDescription:
          "virtual currency changing hands (i.e. paypal, venmo, zelle, etc.)",
        paymentTypeCategoryID: 1,
        expenseDate: "2025-10-03T00:00:00",
        lastUpdated: "0001-01-01T00:00:00",
        expenseDescription: "another new test expense",
        expenseAmount: 100.02,
      },
    ];
    return expenseDataArray;
  }
}
