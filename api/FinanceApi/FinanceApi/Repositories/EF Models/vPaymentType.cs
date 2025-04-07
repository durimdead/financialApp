using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Repositories.EF_Models
{
    public class vPaymentType
    {
        [Key]
        public int PaymentTypeID { get; set; }
        public required string PaymentTypeName { get; set; }
        public required string PaymentTypeDescription { get; set; }
        public int PaymentTypeCategoryID { get; set; }
        public required string PaymentTypeCategoryDescription { get; set; }
    }
}
