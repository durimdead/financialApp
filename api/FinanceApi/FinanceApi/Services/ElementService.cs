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
                elementName = x.PeriodicElementName,
                elementWeight = x.PeriodicElementWeight,
                elementSymbol = x.PeriodicElementSymbol
            }).ToArray();
            return periodicElements;
        }

        /// <summary>
        /// update periodic element in database
        /// </summary>
        /// <param name="elementName">element name (max 50 characters)</param>
        /// <param name="elementSymbol">element symbol (max 3 characters)</param>
        /// <param name="elementWeight">element weight</param>
        /// <param name="elementID">positive integer representing element ID</param>
        /// <exception cref="ArgumentOutOfRangeException">If the elementID is < 1, it is invalid as this would never exist in the database</exception>
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
                    throw new ArgumentOutOfRangeException("Element ID must be larger than 0. ElementId : " + elementID);
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

        /// <summary>
        /// Adds new element to the database. Does not take in an ID since the elementID field is an Identity column
        /// </summary>
        /// <param name="elementName">element name (max 50 characters)</param>
        /// <param name="elementSymbol">element symbol (max 3 characters)</param>
        /// <param name="elementWeight">element weight</param>
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
        /// delete periodic element from database
        /// </summary>
        /// <param name="elementID">id of the element to delete. Will attempt to delete it</param>
        /// <exception cref="ArgumentOutOfRangeException">If the elementID is < 1, it is invalid as this would never exist in the database</exception>
        public void DeleteElement(int elementID)
        {
            try
            {
                // make sure the elementID sent in is going to be valid
                if (elementID < 1)
                {
                    throw new ArgumentOutOfRangeException("Element ID must be larger than 0. ElementId : " + elementID);
                }

                //this.staticPeriodicElements = this.staticPeriodicElements.Where(x => x.elementId != elementId).ToArray();
                this._context.usp_PeriodicElementDelete(elementID);
            }
            catch(Exception e)
            {
                _logger.LogError(e.Message);
                throw;
            }
        }

    }
}
