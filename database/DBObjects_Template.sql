/********************************************************************************************************************************************************************
*	#######	TABLE #######
*
*	Variables :
*		- TableName : 
*			The name of the table you would like to create.
*	Usage : 
*		- Ensure you are scoped to the database that you would like to run this script for!
*		- Do a find and replace on "TableName" with the name you would like to use for the table
*		- Update the definition of the "ID" and "Name" fields if necessary.
*		- Add new columns that fit the rest of your needs
*		- Remember that there are columns already set for auditing, so if you need to do something for who created/updated a record, you could simply add one
*			column named something like "LastUpdatedBy" for your user's UID. It will automatically be audited to show when their data was 
*			"valid" in the table history.
*	Example: 
*		- You are creating a new table called [dbo].[User]
*
*			CREATE TABLE [dbo].[User](
*               [UserID] INT IDENTITY(1,1) NOT NULL
*               ,[UserGivenName] NVARCHAR(50) NOT NULL
*               ,[UserFamilyName] NVARCHAR(50) NOT NULL
*               ,[UserEmailAddress] VARCHAR(250) NOT NULL
*               ,CONSTRAINT [UserID] PRIMARY KEY CLUSTERED
*               ([UserID] ASC)
*               ,[ValidFrom] datetime2 GENERATED ALWAYS AS ROW START
*               ,[ValidTo] datetime2 GENERATED ALWAYS AS ROW END
*               ,PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
*               )
*               WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[UserAudit])
*           );
*           GO
********************************************************************************************************************************************************************/
CREATE TABLE [dbo].[TableName](
	[TableNameID] INT IDENTITY(1,1) NOT NULL
	,[TableNameName] VARCHAR(30) NOT NULL
    ,CONSTRAINT [TableNameID] PRIMARY KEY CLUSTERED
	([TableNameID] ASC)
	,[ValidFrom] datetime2 GENERATED ALWAYS AS ROW START
    ,[ValidTo] datetime2 GENERATED ALWAYS AS ROW END
    ,PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
    )
    WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[TableNameAudit])
);
GO






/********************************************************************************************************************************************************************
*	####### FOREIGN KEY #######
*
*	Variables:
*		- FKDefineTable : 
*			The table you are defining the FK for
*		- FKSourceTable : 
*			The table the foreign key is referencing for the constraint
*		- FKDefineTableColumnname : 
*			The column in the "define" table that will have the FK constraint against it
*		- FKSourceTableColumnname : 
*			The column in the "source" table that will be the basis for the FK constraint
*	Usage : 
*		- Ensure you are scoped to the database that you would like to run this script for!
*		- Find/replace each variable name with the appropriate information
*	example : 
*		- You have a [dbo].[User] table with a column for [UserID] and a [dbo].[Account] table with a [CreatedBy] column that 
*			will have a FK to the [UserID] in the [User] table.
*
*			ALTER TABLE [dbo].[Account]  WITH CHECK ADD  CONSTRAINT [FK_User_Account_CreatedBy] FOREIGN KEY([CreatedBy])
*			REFERENCES [dbo].[User] ([UserID])
*			GO
*			ALTER TABLE [dbo].[User] CHECK CONSTRAINT [FK_User_Account_CreatedBy]
*			GO
********************************************************************************************************************************************************************/
ALTER TABLE [dbo].[FKDefineTable]  WITH CHECK ADD  CONSTRAINT [FK_FKSourceTable_FKDefineTable_FKDefineTableColumnname] FOREIGN KEY([FKDefineTableColumnname])
REFERENCES [dbo].[FKSourceTable] ([FKSourceTableColumnname])
GO
ALTER TABLE [dbo].[FKDefineTable] CHECK CONSTRAINT [FK_FKSourceTable_FKDefineTable_FKDefineTableColumnname]
GO






/********************************************************************************************************************************************************************
*	####### VIEW #######
*
*	Variables:
*		- ViewName : 
*			The name you would like to give your view (a "v" will be added as a prefix to indicate it is a "view")
*		- ColumnName1 : 
*			At least one column name for at least one of the tables in your select
*		- Table1 : 
*			At least one table to grab the information from
*	Usage : 
*		- Ensure you are scoped to the database that you would like to run this script for!
*		- Find and replace "ViewName" with the name you would like your view to have
*		- Ensure to update the select statement to add the appropriate columns / tables
*		- This is a View. As a general standard, views should NOT have WHERE clauses as this would pre-filter the data that you may be expecting to get (ie you
*			create a view for "User" and filter out any records that are not associated to an address - you might want a different view called vUserNoAddress
*			and use an inner join on the FK between them).
*	example : 
*		- We want to have a view that will show user info including any Address we may have for them:
*			CREATE VIEW [dbo].[vUserAddress]
*			AS
*			SELECT
*				[users].[UserGivenName]							 	AS [UserGivenName]
*				[users].[UserFamilyName]						 	AS [UserFamilyName]
*				[users].[UserEmailAddress] 							AS [UserEmailAddress]
*				[address].[FullAddress]								AS [UserAddress]
*				[addressType].[AddressTypeName]						AS [UserAddressType]
*			FROM
*				[dbo].[User] AS [users]
*				LEFT JOIN [dbo].[Address] AS [address] ON [users].[UserID] = [address].[UserID]
*				LEFT JOIN [dbo].[AddressType] AS [addressType] ON [address].[addressTypeID] = [addressType].[addressTypeID]
*			GO  
*		
********************************************************************************************************************************************************************/
CREATE VIEW [dbo].[vViewName]
AS
SELECT
    [ColumnName1]
FROM
    [dbo].[Table1]
GO  






/********************************************************************************************************************************************************************
*	####### STORED PROCEDURE #######
*	template gotten from : https://stackoverflow.com/questions/2073737/nested-stored-procedures-containing-try-catch-rollback-pattern/2074139#2074139
*
*	Variables:
*		- SprocName : 
*			The name you would like to give the stored procedure. It will be prefixed with "usp_" meaning "user stored procedure" to ensure we do not
*			potentially clash with anything in "master" which prefixes with "sp"
*		- AuthorName : 
*			Name of the person writing the stored procedure
*		- CreateDateTime : 
*			DateTime of the creation of the stored procedure
*		- StoredProcedureDescription : 
*			Description of the stored procedure purpose.
*	Usage : 
*		- Ensure you are scoped to the database that you would like to run this script for!
*		- Find and replace all of the variables with the relevant information
*		- Add any parameters you need to add into the "Add any parameters you need here" section
*		- Add your sproc content to the "Contents of your stored procedure go here" section
*	example : 
*		- deletion of a user from the User table:
*			/*
*			===========================================================================================================================================
*			=    Author:
*			=        David Lancellotti
*			=
*			=    Create date: 
*			=        09/17/2022 14:06 PM
*			=
*			=    Description:
*			=        Delete a user record given the UserID
*			=
*			=    UPDATES:
*			=                                DateTime
*			=    Author                        mm/dd/yyyy HH:mm    Description
*			=    =====================        =============        =======================================================================================
*			=
*			=
*			===========================================================================================================================================
*			*/
*			CREATE PROCEDURE [dbo].[usp_UserDelete]
*			    @userID AS INTEGER
*			AS
*			SET XACT_ABORT, NOCOUNT ON
*			DECLARE @starttrancount int
*			BEGIN TRY
*			    SELECT @starttrancount = @@TRANCOUNT
*			
*			    IF @starttrancount = 0
*			        BEGIN TRANSACTION
*			
*			        -- if we can find a record for the userID pushed in, delete it.
*			        -- if we don't find it - no matter, the user doesn't exist anyway and there's nothing to do
*			        IF EXISTS(SELECT 1 FROM [dbo].[User] WHERE [UserID] = @userID)
*			        BEGIN;
*			            DELETE FROM [dbo].[User]
*			            WHERE
*			                [UserID] = @userID
*			        END;
*			
*			    IF @starttrancount = 0 
*			        COMMIT TRANSACTION
*			END TRY
*			BEGIN CATCH
*			    IF XACT_STATE() <> 0 AND @starttrancount = 0 
*			        ROLLBACK TRANSACTION;
*			    THROW;
*			END CATCH
*			GO
*
********************************************************************************************************************************************************************/ 
/*
===============================================================================================================================================
=    Author:
=        AuthorName
=
=    Create date: 
=        CreateDateTime
=
=    Description:
=        StoredProcedureDescription
=
=    UPDATES:
=                                DateTime
=    Author                       mm/dd/yyyy HH:mm    	Description
=    =====================        =============        	=======================================================================================
=
=
===============================================================================================================================================
*/
CREATE PROCEDURE [dbo].[usp_SprocName]
    -- Add any parameters you need here
AS
SET XACT_ABORT, NOCOUNT ON
DECLARE @starttrancount int
BEGIN TRY
    SELECT @starttrancount = @@TRANCOUNT

    IF @starttrancount = 0
        BEGIN TRANSACTION

        -- Contents of your stored procedure go here.
		-- Do not add anything outside of this section of the body of the sproc unless you are 100% certain of what you are doing.
		-- Everything else in the body outside this section manages transaction state.
		-- This allows your sprocs to call other sprocs and have it all be part of the same transaction.

    IF @starttrancount = 0 
        COMMIT TRANSACTION
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 AND @starttrancount = 0 
        ROLLBACK TRANSACTION;
    THROW;
END CATCH
GO