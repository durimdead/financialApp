using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Repositories.EF_Models
{
    public class vExpense
    {
        [Key]
        public int ExpenseID { get; set; }
        public bool IsIncome { get; set; }
        public bool IsInvestment { get; set; }
        public int ExpenseTypeID { get; set; }
        public int PaymentTypeID { get; set; }
        public int PaymentTypeCategoryID { get; set; }
        public string ExpenseDescription { get; set; }
        public DateTime ExpenseDate { get; set; }
        public DateTime LastUpdated { get; set; }
        public decimal ExpenseAmount { get; set; }
    }
}