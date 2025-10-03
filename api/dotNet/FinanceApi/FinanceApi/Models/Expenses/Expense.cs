using FinanceApi.Models.JsonDeserialization.Expenses;

namespace FinanceApi.Models.Expenses
{
    public class Expense
    {
        public Expense()
        {
            ExpenseID = 0;
            ExpenseTypeID = 0;
            PaymentTypeID = 0;
            PaymentTypeCategoryID = 0;
            ExpenseTypeName = string.Empty;
            PaymentTypeName = string.Empty;
            PaymentTypeDescription = string.Empty;
            PaymentTypeCategoryName = string.Empty;
            IsIncome = false;
            IsInvestment = false;
            ExpenseDescription = string.Empty;
            ExpenseAmount = 0;
            ExpenseDate = new DateTime(1, 1, 1);
            LastUpdated = new DateTime(1, 1, 1);
        }

        public Expense(ExpenseJson expenseJson)
        {
            ExpenseID = expenseJson.expenseID;
            ExpenseTypeID = expenseJson.expenseTypeID;
            PaymentTypeID = expenseJson.paymentTypeID;
            PaymentTypeCategoryID = expenseJson.paymentTypeCategoryID;
            ExpenseTypeName = expenseJson.expenseTypeName;
            PaymentTypeName = expenseJson.paymentTypeName;
            PaymentTypeDescription = expenseJson.paymentTypeDescription;
            PaymentTypeCategoryName = expenseJson.paymentTypeCategoryName;
            IsIncome = expenseJson.isIncome;
            IsInvestment = expenseJson.isInvestment;
            ExpenseDescription = expenseJson.expenseDescription;
            ExpenseAmount = expenseJson.expenseAmount;
            ExpenseDate = expenseJson.expenseDate;
            LastUpdated = expenseJson.lastUpdated;
        }

        public int ExpenseID { get; set; }
        public string ExpenseTypeName { get; set; }
        public string PaymentTypeName { get; set; }
        public string PaymentTypeCategoryName { get; set; }
        public bool IsIncome { get; set; }
        public bool IsInvestment { get; set; }
        public int ExpenseTypeID { get; set; }
        public int PaymentTypeID { get; set; }
        public string PaymentTypeDescription { get; set; }
        public int PaymentTypeCategoryID { get; set; }
        public DateTime ExpenseDate { get; set; }
        public DateTime LastUpdated { get; set; }
        public string ExpenseDescription { get; set; }
        public double ExpenseAmount { get; set; }
    }
}
