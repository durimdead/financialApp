namespace FinanceApi.Models.Expenses
{
    public class PaymentType
    {
        public PaymentType() {
            PaymentTypeID = 0;
            PaymentTypeCategoryID = 0;
            PaymentTypeName = string.Empty;
            PaymentTypeDescription = string.Empty;
        }
        public int PaymentTypeID { get; set; }
        public string PaymentTypeName { get; set; }
        public string PaymentTypeDescription { get; set; }
        public int PaymentTypeCategoryID { get; set; }
    }
}
