using FinanceApi.Controllers;
using FinanceApi.Models;
using FinanceApi.Repositories;
using FinanceApi.Services.Interfaces;

namespace FinanceApi.Services
{
    public class ElementService : IElement
    {
        private readonly ILogger<ElementService> _logger;
        private readonly FinancialAppContext _context;
        public ElementService(ILogger<ElementService> logger, FinancialAppContext context) {
            this._logger = logger;
            this._context = context;
        }

        private PeriodicElement[] staticPeriodicElements = new PeriodicElement[] {
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
            //var periodicElements = this._context.vPeriodicElement.ToArray();

            var periodicElements = this._context.vPeriodicElement.Select(x => new PeriodicElement()
            {
                actions = "",
                elementId = x.PeriodicElementID,
                name = x.PeriodicElementName,
                weight = x.PeriodicElementWeight,
                symbol = x.PeriodicElementSymbol
            }).ToArray();
            return periodicElements;
        }

        /// <summary>
        /// update periodic element in source
        /// </summary>
        /// <param name="elementToUpdate">will update this element. Finds the correct record to update based on ElementId in this object</param>
        public void UpdateElement(string elementName, string elementSymbol, double elementWeight, int elementID) {
            try
            {
                //// make sure we are able to update the element sent in
                //if (elementToUpdate == null)
                //{
                //    throw new NullReferenceException("The elementToUpdate argument cannot be null");
                //}
                //else if (elementToUpdate.elementId < 1 || this.staticPeriodicElements.Count(element => element.elementId == elementToUpdate.elementId) != 1)
                //{
                //    throw new KeyNotFoundException("Element Id is missing or is not within our records. ElementId : " + elementToUpdate.elementId);
                //}

                // make sure the elementID sent in is going to be valid
                if (elementID < 1)
                {
                    throw new KeyNotFoundException("Element Id is missing. ElementId : " + elementID);
                }

                // update the element with the parameter
                //this.staticPeriodicElements[Array.FindIndex(this.staticPeriodicElements, element => element.elementId == elementToUpdate.elementId)] = elementToUpdate;
                //var elements = this.staticPeriodicElements;
                this._context.usp_PeriodicElementUpsert(elementName, elementSymbol, elementWeight, elementID);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                throw;
            }
        }

        public void AddElement(string elementName, string elementSymbol, double elementWeight)
        {
            try
            {
                //// ensure we have a valid element to add to the array
                //if (elementToAdd == null)
                //{
                //    throw new NullReferenceException("The elementToUpdate argument cannot be null");
                //}
                //else if (elementToAdd.elementId < 1 || this.staticPeriodicElements.Count(element => element.elementId == elementToAdd.elementId) == 1)
                //{
                //    throw new KeyNotFoundException("Element Id is not valid as it is either missing( less than 1 ) or is already within our records. ElementId : " + elementToAdd.elementId);
                //}

                // call the db upsert
                this._context.usp_PeriodicElementUpsert(elementName, elementSymbol, elementWeight, 0);

                // this is awful - would look for another way, but looking to update the collection to be in a database later anyway.
                //this.staticPeriodicElements = this.staticPeriodicElements.ToList().Append(elementToAdd).ToArray();
                //var elements = this.staticPeriodicElements;
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                throw;
            }
        }

        /// <summary>
        /// delete periodic element from source
        /// </summary>
        /// <param name="elementId">id of the element to delete</param>
        public void DeleteElement(int elementId)
        {
            try
            {
                //this.staticPeriodicElements = this.staticPeriodicElements.Where(x => x.elementId != elementId).ToArray();
                this._context.usp_PeriodicElementDelete(elementId);
            }
            catch(Exception e)
            {
                _logger.LogError(e.Message);
                throw;
            }
        }

    }
}
