using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Models.Expenses
{
    public class ExpenseDetail
    {
        public ExpenseDetail()
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
        [Key]
        public int ExpenseID { get; set; }
        public required string ExpenseTypeName { get; set; }
        public required string PaymentTypeName { get; set; }
        public required string PaymentTypeCategoryName { get; set; }
        public bool IsIncome { get; set; }
        public bool IsInvestment { get; set; }
        public int ExpenseTypeID { get; set; }
        public int PaymentTypeID { get; set; }
        public required string PaymentTypeDescription { get; set; }
        public int PaymentTypeCategoryID { get; set; }
        public DateTime ExpenseDate { get; set; }
        public DateTime LastUpdated { get; set; }
        public string ExpenseDescription { get; set; }
        public double ExpenseAmount { get; set; }
    }
}
