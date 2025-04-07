namespace FinanceApi.Models.Expenses
{
    public class Expense
    {
        public int ExpenseId { get; set; }
        public string ExpenseDescription { get; set; }
        public int ExpenseTypeId { get; set; }
        public int PaymentTypeId { get; set; }
        public int PaymentTypeCategoryId { get; set; }
        public bool IsIncome { get; set; }
        public bool IsInvestment { get; set; }
        public DateTime ExpenseDate { get; set; }
        public DateTime LastUpdated { get; set; }
        public decimal ExpenseAmount { get; set; }
    }
}
