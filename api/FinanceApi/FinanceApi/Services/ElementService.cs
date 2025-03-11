using FinanceApi.Controllers;
using FinanceApi.Models;
using FinanceApi.Services.Interfaces;

namespace FinanceApi.Services
{
    public class ElementService : IElement
    {
        private readonly ILogger<ElementService> _logger;
        public ElementService(ILogger<ElementService> logger) {
            this._logger = logger;
        }

        private PeriodicElement[] periodicElements = new PeriodicElement[] {
            new PeriodicElement(){ actions = "", elementId = 1, name = "Hydrogen", weight = 1.0079, symbol = "H" },
            new PeriodicElement(){ actions = "", elementId = 2, name = "Helium", weight = 4.0026, symbol = "He" },
            new PeriodicElement(){ actions = "", elementId = 3, name = "Lithium", weight = 6.941, symbol = "Li" },
            new PeriodicElement(){ actions = "", elementId = 4, name = "Beryllium", weight = 9.0122, symbol = "Be" },
            new PeriodicElement(){ actions = "", elementId = 5, name = "Boron", weight = 10.811, symbol = "B" },
            new PeriodicElement(){ actions = "", elementId = 6, name = "Carbon", weight = 12.0107, symbol = "C" },
            new PeriodicElement(){ actions = "", elementId = 7, name = "Nitrogen", weight = 14.0067, symbol = "N" },
            new PeriodicElement(){ actions = "", elementId = 8, name = "Oxygen", weight = 15.9994, symbol = "O" },
            new PeriodicElement(){ actions = "", elementId = 9, name = "Fluorine", weight = 18.9984, symbol = "F" },
            new PeriodicElement(){ actions = "", elementId = 10, name = "Neon", weight = 20.1797, symbol = "Ne" }
        };

        /// <summary>
        /// returns all elements in the array
        /// </summary>
        /// <returns></returns>
        public PeriodicElement[] GetElements()
        {
            return this.periodicElements;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="elementToUpdate">will update this element. Finds the correct record to update based on ElementId in this object</param>
        public void UpdateElement(PeriodicElement elementToUpdate) {
            try
            {
                // make sure we are able to update the element sent in
                if (elementToUpdate == null)
                {
                    throw new NullReferenceException("The elementToUpdate argument cannot be null");
                }
                else if (elementToUpdate.elementId < 1 || this.periodicElements.Count(element => element.elementId == elementToUpdate.elementId) != 1)
                {
                    throw new KeyNotFoundException("Element Id is not within our records");
                }

                // update the element with the parameter
                this.periodicElements[Array.FindIndex(this.periodicElements, element => element.elementId == elementToUpdate.elementId)] = elementToUpdate;
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                throw;
            }
        }

    }
}
