using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Repositories.EF_Models
{
    public class vExpenseDetails
    {
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
        public decimal ExpenseAmount { get; set; }
    }
}