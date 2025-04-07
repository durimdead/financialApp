namespace FinanceApi.Models.Expenses
{
    public class PaymentType
    {
        public int PaymentTypeID { get; set; }
        public string PaymentTypeName { get; set; }
        public string PaymentTypeDescription { get; set; }
        public int PaymentTypeCategoryID { get; set; }
    }
}
