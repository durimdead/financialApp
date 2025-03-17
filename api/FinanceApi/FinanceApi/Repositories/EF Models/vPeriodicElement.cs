using System.ComponentModel.DataAnnotations;

namespace FinanceApi.Repositories.EF_Models
{
    public class vPeriodicElement
    {
        [Key]
        public int PeriodicElementID {  get; set; }
        public string PeriodicElementName { get; set; }
        public string PeriodicElementSymbol { get; set; }
        public double PeriodicElementWeight { get; set; }
    }
}
