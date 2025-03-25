/********************************************************************************************************************************************************************
*	#######	TABLE #######
*
*	Variables :
*		- TableName : The name of the table you would like to create.
*	Usage : 
*		- Do a find and replace on "TableName" with the name you would like to use for the table
*		- Update the definition of the "ID" and "Name" fields if necessary.
*		- Add new columns that fit the rest of your needs
*		- Remember that there are columns already set for auditing, so if you need to do something for who created/updated a record, you could simply add one
*			column named something like "LastUpdatedBy" for your user's UID. It will automatically be audited to show when their data was 
*			"valid" in the table history.
*	Example: 
*		- You are creating a new table called [dbo].[User]
*			CREATE TABLE [dbo].[User](
                [UserID] INT IDENTITY(1,1) NOT NULL
                ,[UserGivenName] NVARCHAR(50) NOT NULL
                ,[UserFamilyName] NVARCHAR(50) NOT NULL
                ,[UserEmailAddress] VARCHAR(250) NOT NULL
                ,CONSTRAINT [UserID] PRIMARY KEY CLUSTERED
                ([UserID] ASC)
                ,[ValidFrom] datetime2 GENERATED ALWAYS AS ROW START
                ,[ValidTo] datetime2 GENERATED ALWAYS AS ROW END
                ,PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
                )
                WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[UserAudit])
            );
            GO
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
*		- FKDefineTable : The table you are defining the FK for
*		- FKSourceTable : The table the foreign key is referencing for the constraint
*		- FKDefineTableColumnname : The column in the "define" table that will have the FK constraint against it
*		- FKSourceTableColumnname : The column in the "source" table that will be the basis for the FK constraint
*	Usage : 
*		- find/replace each variable name with the appropriate information
*	example : 
*		- You have a [dbo].[User] table with a column for [UserID] and a [dbo].[Account] table with a [CreatedBy] column that 
*			will have a FK to the [UserID] in the [User] table.
*		- The definition would look like this :
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