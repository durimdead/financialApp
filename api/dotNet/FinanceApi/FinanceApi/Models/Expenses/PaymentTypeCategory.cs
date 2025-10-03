namespace FinanceApi.Models.Expenses
{
    public class PaymentTypeCategory
    {
        public PaymentTypeCategory()
        {
            PaymentTypeCategoryID = 0;
            PaymentTypeCategoryName = string.Empty;
        }
        public int PaymentTypeCategoryID { get; set; }
        public string PaymentTypeCategoryName { get; set; }
    }
}
