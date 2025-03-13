using FinanceApi.Models;

namespace FinanceApi.Services.Interfaces
{
    public interface IElement
    {
        public void UpdateElement(PeriodicElement elementToUpdate);
        public void DeleteElement(int elementId);
    }
}
