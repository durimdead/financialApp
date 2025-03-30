using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Repositories.EF_Models
{
    public class vExpenseDetails
    {
        [Key]
        public int ExpenseID { get; set; }
        public string ExpenseTypeName { get; set; }
        public string PaymentTypeName { get; set; }
        public string PaymentTypeCategoryName { get; set; }
        public bool IsIncome { get; set; }
        public bool IsInvestment { get; set; }
        public int ExpenseTypeID {  get; set; }
        public int PaymentTypeID { get; set; }
        public string PaymentTypeDescription { get; set; }
        public int PaymentTypeCategoryID { get; set; }
    }
}