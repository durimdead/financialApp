namespace FinanceApi.Models.Expenses
{
    public class ExpenseType
    {
        public ExpenseType()
        {
            ExpenseTypeID = 0;
            ExpenseTypeName = string.Empty;
            ExpenseTypeDescription = string.Empty;
        }
        public int ExpenseTypeID { get; set; }
        public string ExpenseTypeName { get; set; }
        public string ExpenseTypeDescription { get; set; }
    }
}
