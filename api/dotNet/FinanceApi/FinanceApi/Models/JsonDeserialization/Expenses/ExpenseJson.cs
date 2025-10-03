namespace FinanceApi.Models.JsonDeserialization.Expenses
{
    public class ExpenseJson
    {
        public ExpenseJson()
        {
            expenseID = 0;
            expenseTypeID = 0;
            paymentTypeID = 0;
            paymentTypeCategoryID = 0;
            expenseTypeName = string.Empty;
            paymentTypeName = string.Empty;
            paymentTypeDescription = string.Empty;
            paymentTypeCategoryName = string.Empty;
            isIncome = false;
            isInvestment = false;
            expenseDescription = string.Empty;
            expenseAmount = 0;
            expenseDate = new DateTime(1, 1, 1);
            lastUpdated = new DateTime(1, 1, 1);
        }
        public int expenseID { get; set; }
        public string expenseTypeName { get; set; }
        public string paymentTypeName { get; set; }
        public string paymentTypeCategoryName { get; set; }
        public bool isIncome { get; set; }
        public bool isInvestment { get; set; }
        public int expenseTypeID { get; set; }
        public int paymentTypeID { get; set; }
        public string paymentTypeDescription { get; set; }
        public int paymentTypeCategoryID { get; set; }
        public DateTime expenseDate { get; set; }
        public DateTime lastUpdated { get; set; }
        public string expenseDescription { get; set; }
        public double expenseAmount { get; set; }
    }
}
