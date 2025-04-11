using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Repositories.EF_Models
{
    public class vExpense
    {
        public vExpense()
        {
            ExpenseID = 0;
            ExpenseTypeID = 0;
            PaymentTypeID = 0;
            PaymentTypeCategoryID = 0;
            IsIncome = false;
            IsInvestment = false;
            ExpenseDescription = string.Empty;
            ExpenseAmount = 0;
            ExpenseDate = new DateTime(1, 1, 1);
            LastUpdated = new DateTime(1, 1, 1);
        }
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