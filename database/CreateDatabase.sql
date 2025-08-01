/************************************************************************
*
*
*           BEGIN database script from SSMS "script as" command
*
*
************************************************************************/

USE [master]
GO

/****** Object:  Database [FinancialApp] ******/
CREATE DATABASE [FinancialApp]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'FinancialApp', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\FinancialApp.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'FinancialApp_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\FinancialApp_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [FinancialApp].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO

ALTER DATABASE [FinancialApp] SET ANSI_NULL_DEFAULT OFF 
GO

ALTER DATABASE [FinancialApp] SET ANSI_NULLS OFF 
GO

ALTER DATABASE [FinancialApp] SET ANSI_PADDING OFF 
GO

ALTER DATABASE [FinancialApp] SET ANSI_WARNINGS OFF 
GO

ALTER DATABASE [FinancialApp] SET ARITHABORT OFF 
GO

ALTER DATABASE [FinancialApp] SET AUTO_CLOSE OFF 
GO

ALTER DATABASE [FinancialApp] SET AUTO_SHRINK OFF 
GO

ALTER DATABASE [FinancialApp] SET AUTO_UPDATE_STATISTICS ON 
GO

ALTER DATABASE [FinancialApp] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO

ALTER DATABASE [FinancialApp] SET CURSOR_DEFAULT  GLOBAL 
GO

ALTER DATABASE [FinancialApp] SET CONCAT_NULL_YIELDS_NULL OFF 
GO

ALTER DATABASE [FinancialApp] SET NUMERIC_ROUNDABORT OFF 
GO

ALTER DATABASE [FinancialApp] SET QUOTED_IDENTIFIER OFF 
GO

ALTER DATABASE [FinancialApp] SET RECURSIVE_TRIGGERS OFF 
GO

ALTER DATABASE [FinancialApp] SET  DISABLE_BROKER 
GO

ALTER DATABASE [FinancialApp] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO

ALTER DATABASE [FinancialApp] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO

ALTER DATABASE [FinancialApp] SET TRUSTWORTHY OFF 
GO

ALTER DATABASE [FinancialApp] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO

ALTER DATABASE [FinancialApp] SET PARAMETERIZATION SIMPLE 
GO

ALTER DATABASE [FinancialApp] SET READ_COMMITTED_SNAPSHOT OFF 
GO

ALTER DATABASE [FinancialApp] SET HONOR_BROKER_PRIORITY OFF 
GO

ALTER DATABASE [FinancialApp] SET RECOVERY FULL 
GO

ALTER DATABASE [FinancialApp] SET  MULTI_USER 
GO

ALTER DATABASE [FinancialApp] SET PAGE_VERIFY CHECKSUM  
GO

ALTER DATABASE [FinancialApp] SET DB_CHAINING OFF 
GO

ALTER DATABASE [FinancialApp] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO

ALTER DATABASE [FinancialApp] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO

ALTER DATABASE [FinancialApp] SET DELAYED_DURABILITY = DISABLED 
GO

ALTER DATABASE [FinancialApp] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO

ALTER DATABASE [FinancialApp] SET QUERY_STORE = OFF
GO

ALTER DATABASE [FinancialApp] SET  READ_WRITE 
GO


/************************************************************************
*       #########################################################
*
*           END database script from SSMS "script as" command
*           
*       #########################################################
************************************************************************/



/************************************************************************
*
*
*           BEGIN user creation for use within the project
*
*
************************************************************************/

-- create the user in master db
USE [master]
GO
IF NOT EXISTS (SELECT 1 FROM master.sys.server_principals WHERE name = 'FinancialAppAccount')
BEGIN;
	CREATE LOGIN [FinancialAppAccount] WITH PASSWORD=N'myTestAccount123', DEFAULT_DATABASE=[FinancialApp]
END;
GO

-- create the user in the application db and then tie it to the account created on the server
-- also, add them to the appropriate roles
USE [FinancialApp]
GO
CREATE USER [FinancialAppAccount] FOR LOGIN [FinancialAppAccount] WITH DEFAULT_SCHEMA=[dbo]
ALTER ROLE [db_datareader] add member [FinancialAppAccount];
ALTER ROLE [db_datawriter] add member [FinancialAppAccount];
GO

-- grant execute permissions for Sprocs
GRANT EXECUTE TO [FinancialAppAccount]
GO


/************************************************************************
*
*
*           BEGIN table creation for [FinancialApp] database
*
*
************************************************************************/
USE [FinancialApp]
GO

-- date night, car maintenance, tolls, grocery, etc.
CREATE TABLE [dbo].[ExpenseType](
    [ExpenseTypeID] INT IDENTITY(1,1) NOT NULL
    ,[ExpenseTypeName] VARCHAR(50) NOT NULL
    ,[ExpenseTypeDescription] VARCHAR(250)
	,CONSTRAINT [AK_ExpenseType_ExpenseTypeName] UNIQUE(ExpenseTypeName)
    ,CONSTRAINT [ExpenseTypeID] PRIMARY KEY CLUSTERED
    ([ExpenseTypeID] ASC)
    ,[ValidFrom] datetime2 GENERATED ALWAYS AS ROW START
    ,[ValidTo] datetime2 GENERATED ALWAYS AS ROW END
    ,PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
    )
    WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[ExpenseTypeAudit])
);
GO

-- credit card, debit card, cash app, check, etc
CREATE TABLE [dbo].[PaymentTypeCategory](
    [PaymentTypeCategoryID] INT IDENTITY(1,1) NOT NULL
    ,[PaymentTypeCategoryName] VARCHAR(30) NOT NULL
	,CONSTRAINT [AK_PaymentTypeCategory_PaymentTypeCategoryName] UNIQUE(PaymentTypeCategoryName)
    ,CONSTRAINT [PaymentTypeCategoryID] PRIMARY KEY CLUSTERED
    ([PaymentTypeCategoryID] ASC)
    ,[ValidFrom] datetime2 GENERATED ALWAYS AS ROW START
    ,[ValidTo] datetime2 GENERATED ALWAYS AS ROW END
    ,PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
    )
    WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PaymentTypeCategoryAudit])
);
GO

-- chase freedom, chase debit, cash, venmo, zelle, etc
CREATE TABLE [dbo].[PaymentType](
    [PaymentTypeID] INT IDENTITY(1,1) NOT NULL
    ,[PaymentTypeCategoryID] INT NOT NULL
    ,[PaymentTypeName] VARCHAR(50) NOT NULL
    ,[PaymentTypeDescription] VARCHAR(250) NOT NULL
	,CONSTRAINT [AK_PaymentType_PaymentTypeName] UNIQUE(PaymentTypeName)
    ,CONSTRAINT [PaymentTypeID] PRIMARY KEY CLUSTERED
    ([PaymentTypeID] ASC)
    ,[ValidFrom] datetime2 GENERATED ALWAYS AS ROW START
    ,[ValidTo] datetime2 GENERATED ALWAYS AS ROW END
    ,PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
    )
    WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PaymentTypeAudit])
);
GO

-- PaymentTypeCategoryID
ALTER TABLE [dbo].[PaymentType]  WITH CHECK ADD  CONSTRAINT [FK_PaymentTypeCategory_PaymentType_PaymentTypeCategoryID] FOREIGN KEY([PaymentTypeCategoryID])
REFERENCES [dbo].[PaymentTypeCategory] ([PaymentTypeCategoryID])
GO
ALTER TABLE [dbo].[PaymentType] CHECK CONSTRAINT [FK_PaymentTypeCategory_PaymentType_PaymentTypeCategoryID]
GO

CREATE TABLE [dbo].[Expense](
    [ExpenseID] INT IDENTITY(1,1) NOT NULL
    ,[ExpenseTypeID] INT NOT NULL
    ,[PaymentTypeID] INT NOT NULL
    ,[PaymentTypeCategoryID] INT NOT NULL
    ,[ExpenseDescription] NVARCHAR(200) NOT NULL
    ,[IsIncome] BIT NOT NULL
    ,[IsInvestment] BIT NOT NULL
	,[ExpenseDate] DATE NOT NULL
	,[ExpenseAmount] DECIMAL(20,4) -- can store up to 1 quadrillion with 4 decimal places to cover most to all currency types
    ,CONSTRAINT [ExpenseID] PRIMARY KEY CLUSTERED
    ([ExpenseID] ASC)
    ,[ValidFrom] datetime2 GENERATED ALWAYS AS ROW START
    ,[ValidTo] datetime2 GENERATED ALWAYS AS ROW END
    ,PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
    )
    WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[ExpenseAudit])
);
GO

-- FK for PaymentTypeID
ALTER TABLE [dbo].[Expense]  WITH CHECK ADD  CONSTRAINT [FK_PaymentType_Expense_PaymentTypeID] FOREIGN KEY([PaymentTypeID])
REFERENCES [dbo].[PaymentType] ([PaymentTypeID])
GO
ALTER TABLE [dbo].[Expense] CHECK CONSTRAINT [FK_PaymentType_Expense_PaymentTypeID]
GO

-- FK for PaymentTypeCategoryID
ALTER TABLE [dbo].[Expense]  WITH CHECK ADD  CONSTRAINT [FK_PaymentTypeCategory_Expense_PaymentTypeCategoryID] FOREIGN KEY([PaymentTypeCategoryID])
REFERENCES [dbo].[PaymentTypeCategory] ([PaymentTypeCategoryID])
GO
ALTER TABLE [dbo].[Expense] CHECK CONSTRAINT [FK_PaymentTypeCategory_Expense_PaymentTypeCategoryID]
GO

-- FK for ExpenseTypeID
ALTER TABLE [dbo].[Expense]  WITH CHECK ADD  CONSTRAINT [FK_ExpenseType_Expense_ExpenseTypeID] FOREIGN KEY([ExpenseTypeID])
REFERENCES [dbo].[ExpenseType] ([ExpenseTypeID])
GO
ALTER TABLE [dbo].[Expense] CHECK CONSTRAINT [FK_ExpenseType_Expense_ExpenseTypeID]
GO


/************************************************************************
*       #########################################################
*           
*           END table creation for [FinancialApp] database
*           
*       #########################################################
************************************************************************/


/************************************************************************
*
*
*           BEGIN stored procedures -- template gotten from : https://stackoverflow.com/questions/2073737/nested-stored-procedures-containing-try-catch-rollback-pattern/2074139#2074139
*
*
************************************************************************/
USE [FinancialApp]
GO

/*
===========================================================================================================================================
=    Author:
=        David Lancellotti
=
=    Create date: 
=        03/27/2025 03:00PM
=
=    Description:
=        Update or insert an Expense Type with the relevant information
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE PROCEDURE [dbo].[usp_ExpenseTypeUpsert]
    @expenseTypeID AS INT
    ,@expenseTypeName AS VARCHAR(50)
    ,@expenseTypeDescription AS VARCHAR(250)
AS
SET XACT_ABORT, NOCOUNT ON
DECLARE @starttrancount int
BEGIN TRY
    SELECT @starttrancount = @@TRANCOUNT

    IF @starttrancount = 0
        BEGIN TRANSACTION

        -- trim our varchar inputs to ensure we have no whitespace
        SET @expenseTypeName = LTRIM(RTRIM(@expenseTypeName));
        SET @expenseTypeDescription = LTRIM(RTRIM(@expenseTypeDescription));

        -- if we can find a record with the ExpenseTypeID pushed in, let's update the information for it
        IF EXISTS(SELECT 1 FROM [dbo].[ExpenseType] WHERE [ExpenseTypeID] = @expenseTypeID)
        BEGIN;
            UPDATE [dbo].[ExpenseType]
            SET
                [ExpenseTypeName] = @expenseTypeName
                ,[ExpenseTypeDescription] = @expenseTypeDescription
            WHERE
                [ExpenseTypeID] = @expenseTypeID
        END;
        -- else, we check to see if the ExpenseTypeID sent in is 0 - indicating a new record
        ELSE IF (@expenseTypeID = 0)
        BEGIN;
            INSERT INTO [dbo].[ExpenseType](
                [ExpenseTypeName]
                ,[ExpenseTypeDescription]
            )
            VALUES(
                @expenseTypeName
                ,@expenseTypeDescription
            );
        END;
        -- if the ID doesn't exists and is not 0, the expense type doesn't exist and we can't update it.
        ELSE
        BEGIN;
            DECLARE @errorMessage VARCHAR(100) = 'The ExpenseTypeID does not exist: ' + CONVERT(VARCHAR(20), @expenseTypeID);
            THROW 51001, @errorMessage, 1;
        END;

    IF @starttrancount = 0 
        COMMIT TRANSACTION
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 AND @starttrancount = 0 
        ROLLBACK TRANSACTION;
    THROW;
END CATCH
GO



/*
===========================================================================================================================================
=    Author:
=        David Lancellotti
=
=    Create date: 
=        03/27/2025 03:00PM
=
=    Description:
=        Delete an expense type record given the ExpenseTypeID
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE PROCEDURE [dbo].[usp_ExpenseTypeDelete]
    @expenseTypeID AS INT
AS
SET XACT_ABORT, NOCOUNT ON
DECLARE @starttrancount int
BEGIN TRY
    SELECT @starttrancount = @@TRANCOUNT

    IF @starttrancount = 0
        BEGIN TRANSACTION

        -- if we can find a record for the expense type pushed in, delete it.
        -- if we don't find it - no matter, the expense type referenced doesn't exist and there's nothing to do
        IF EXISTS(SELECT 1 FROM [dbo].[ExpenseType] WHERE [ExpenseTypeID] = @expenseTypeID)
        BEGIN;
            DELETE FROM [dbo].[ExpenseType]
            WHERE
                [ExpenseTypeID] = @expenseTypeID
        END;

    IF @starttrancount = 0 
        COMMIT TRANSACTION
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 AND @starttrancount = 0 
        ROLLBACK TRANSACTION;
    THROW;
END CATCH
GO

/*
===========================================================================================================================================
=    Author:
=        David Lancellotti
=
=    Create date: 
=        03/27/2025 03:05PM
=
=    Description:
=        Update or insert an Payment Type Category with the relevant information
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE PROCEDURE [dbo].[usp_PaymentTypeCategoryUpsert]
    @paymentTypeCategoryID AS INT
    ,@paymentTypeCategoryName AS VARCHAR(50)
AS
SET XACT_ABORT, NOCOUNT ON
DECLARE @starttrancount int
BEGIN TRY
    SELECT @starttrancount = @@TRANCOUNT

    IF @starttrancount = 0
        BEGIN TRANSACTION

        -- trim our varchar inputs to ensure we have no whitespace
        SET @paymentTypeCategoryName = LTRIM(RTRIM(@paymentTypeCategoryName));

        -- if we can find a record with the PaymentTypeCategoryID pushed in, let's update the information for it
        IF EXISTS(SELECT 1 FROM [dbo].[PaymentTypeCategory] WHERE [PaymentTypeCategoryID] = @paymentTypeCategoryID)
        BEGIN;
            UPDATE [dbo].[PaymentTypeCategory]
            SET
                [PaymentTypeCategoryName] = @paymentTypeCategoryName
            WHERE
                [PaymentTypeCategoryID] = @paymentTypeCategoryID
        END;
        -- else, we check to see if the PaymentTypeCategoryID sent in is 0 - indicating a new record
        ELSE IF (@paymentTypeCategoryID = 0)
        BEGIN;
            INSERT INTO [dbo].[PaymentTypeCategory](
                [PaymentTypeCategoryName]
            )
            VALUES(
                @paymentTypeCategoryName
            );
        END;
        -- if the ID doesn't exists and is not 0, the payment type category doesn't exist and we can't update it.
        ELSE
        BEGIN;
            DECLARE @errorMessage VARCHAR(100) = 'The PaymentTypeCategoryID does not exist: ' + CONVERT(VARCHAR(20), @paymentTypeCategoryID);
            THROW 51001, @errorMessage, 1;
        END;

    IF @starttrancount = 0 
        COMMIT TRANSACTION
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 AND @starttrancount = 0 
        ROLLBACK TRANSACTION;
    THROW;
END CATCH
GO



/*
===========================================================================================================================================
=    Author:
=        David Lancellotti
=
=    Create date: 
=        03/27/2025 03:05PM
=
=    Description:
=        Delete a payment type category record given the PaymentTypeCategoryID
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE PROCEDURE [dbo].[usp_PaymentTypeCategoryDelete]
    @paymentTypeCategoryID AS INT
AS
SET XACT_ABORT, NOCOUNT ON
DECLARE @starttrancount int
BEGIN TRY
    SELECT @starttrancount = @@TRANCOUNT

    IF @starttrancount = 0
        BEGIN TRANSACTION

        -- if we can find a record for the payment type category pushed in, delete it.
        -- if we don't find it - no matter, the payment type category referenced doesn't exist and there's nothing to do.
        IF EXISTS(SELECT 1 FROM [dbo].[PaymentTypeCategory] WHERE [PaymentTypeCategoryID] = @paymentTypeCategoryID)
        BEGIN;
            DELETE FROM [dbo].[PaymentTypeCategory]
            WHERE
                [PaymentTypeCategoryID] = @paymentTypeCategoryID
        END;

    IF @starttrancount = 0 
        COMMIT TRANSACTION
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 AND @starttrancount = 0 
        ROLLBACK TRANSACTION;
    THROW;
END CATCH
GO


/*
===========================================================================================================================================
=    Author:
=       David Lancellotti
=
=    Create date: 
=       03/28/2025 02:05 PM
=
=    Description:
=       Update or insert a payment type record with the relevant information.
=       Additionally, ensure that the paymentTypeCategoryID exists - throws error if it does not.
=
=    UPDATES:
=                                DateTime
=    Author                       mm/dd/yyyy HH:mm     Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE PROCEDURE [dbo].[usp_PaymentTypeUpsert]
    @paymentTypeID AS INT
    ,@paymentTypeName AS VARCHAR(50)
    ,@paymentTypeDescription AS VARCHAR(250)
    ,@paymentTypeCategoryID AS INT
AS
SET XACT_ABORT, NOCOUNT ON
DECLARE @starttrancount int
BEGIN TRY
    SELECT @starttrancount = @@TRANCOUNT

    IF @starttrancount = 0
        BEGIN TRANSACTION

        -- trim our varchar inputs to ensure we have no whitespace
        SET @paymentTypeName = LTRIM(RTRIM(@paymentTypeName));
        SET @paymentTypeDescription = LTRIM(RTRIM(@paymentTypeDescription));

        -- Ensure that the paymentTypeCategoryID exists
        IF NOT EXISTS(SELECT 1 FROM [dbo].[PaymentTypeCategory] WHERE [PaymentTypeCategoryID] = @paymentTypeCategoryID)
        BEGIN;
            DECLARE @errorMessage_FKsDoNotExist VARCHAR(200) = 'The PaymentTypeCategoryID does not exist: ' + CONVERT(VARCHAR(20), @paymentTypeCategoryID);
            THROW 51001, @errorMessage_FKsDoNotExist, 1;
        END;

        -- if we can find a record with the paymentTypeID pushed in, let's update the information for it
        IF EXISTS(SELECT 1 FROM [dbo].[PaymentType] WHERE [PaymentTypeID] = @paymentTypeID)
        BEGIN;
            -- Update PaymentType Table
            UPDATE [dbo].[PaymentType]
            SET
                [PaymentTypeName] = @paymentTypeName
                ,[PaymentTypeDescription] = @paymentTypeDescription
                ,[PaymentTypeCategoryID] = @paymentTypeCategoryID
            WHERE
                [PaymentTypeID] = @paymentTypeID
        END;
        -- else, we check to see if the paymentTypeID sent in is 0 - indicating a new payment type
        ELSE IF (@paymentTypeID = 0)
        BEGIN;
            -- create new payment type
            INSERT INTO [dbo].[PaymentType](
                [PaymentTypeName]
                ,[PaymentTypeDescription]
                ,[PaymentTypeCategoryID]
            )
            VALUES(
                @paymentTypeName
                ,@paymentTypeDescription
                ,@paymentTypeCategoryID
            );
        END;
        -- if the ID doesn't exists and is not 0, the payment type doesn't exist and we can't update it.
        ELSE
        BEGIN;
            DECLARE @errorMessage VARCHAR(100) = 'The paymentTypeID does not exist: ' + CONVERT(VARCHAR(20), @paymentTypeID);
            THROW 51001, @errorMessage, 1;
        END;

    IF @starttrancount = 0 
        COMMIT TRANSACTION
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 AND @starttrancount = 0 
        ROLLBACK TRANSACTION;
    THROW;
END CATCH
GO



/*
===========================================================================================================================================
=    Author:
=        David Lancellotti
=
=    Create date: 
=        03/29/2025 05:47 PM
=
=    Description:
=        Delete a payment type record given the paymentTypeID
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE PROCEDURE [dbo].[usp_PaymentTypeDelete]
    @paymentTypeID AS INT
AS
SET XACT_ABORT, NOCOUNT ON
DECLARE @starttrancount int
BEGIN TRY
    SELECT @starttrancount = @@TRANCOUNT

    IF @starttrancount = 0
        BEGIN TRANSACTION

        -- if we can find a record for the paymentTypeID pushed in, delete it.
        -- if we don't find it - no matter, the paymentType doesn't exist anyway and there's nothing to do
        IF EXISTS(SELECT 1 FROM [dbo].[PaymentType] WHERE [PaymentTypeID] = @paymentTypeID)
        BEGIN;
            DELETE FROM [dbo].[PaymentType]
            WHERE
                [PaymentTypeID] = @paymentTypeID
        END;

    IF @starttrancount = 0 
        COMMIT TRANSACTION
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 AND @starttrancount = 0 
        ROLLBACK TRANSACTION;
    THROW;
END CATCH
GO



/*
===========================================================================================================================================
=    Author:
=       David Lancellotti
=
=    Create date: 
=       03/29/2025 06:10 PM
=
=    Description:
=       Update or insert a expense record with the relevant information.
=       Additionally, ensure that the FK IDs exist - throws error if any do not.
=
=    UPDATES:
=                                DateTime
=    Author                      mm/dd/yyyy HH:mm   	Description
=    =====================       =============      	===================================================================================
=	 David Lancellotti			 04/02/2025 12:35		Added in "expenseDate" param as this column was added to the table
=	 David Lancellotti			 04/07/2025 12:00		Added in "expenseAmount" param as this column was added to the table
=
===========================================================================================================================================
*/
CREATE PROCEDURE [dbo].[usp_ExpenseUpsert]
    @expenseID AS INT
    ,@expenseTypeID INT
    ,@paymentTypeID INT
    ,@paymentTypeCategoryID INT
    ,@expenseDescription NVARCHAR(200)
    ,@isIncome BIT
    ,@isInvestment BIT
	,@expenseDate DATE
	,@expenseAmount DECIMAL(20,4)
AS
SET XACT_ABORT, NOCOUNT ON
DECLARE @starttrancount int
BEGIN TRY
    SELECT @starttrancount = @@TRANCOUNT

    IF @starttrancount = 0
        BEGIN TRANSACTION

        -- trim our varchar inputs to ensure we have no whitespace
        SET @expenseDescription = LTRIM(RTRIM(@expenseDescription));

        /***************************
         * Check for FKs existing
         **************************/
        DECLARE @errorMessage_FKsDoNotExist VARCHAR(200) = '';

        -- Ensure that the expenseTypeID exists
        IF NOT EXISTS(SELECT 1 FROM [dbo].[ExpenseType] WHERE [ExpenseTypeID] = @expenseTypeID)
        BEGIN;
            SET @errorMessage_FKsDoNotExist += 'The ExpenseTypeID does not exist: ' + CONVERT(VARCHAR(20), @expenseTypeID) + ' :::: ';
        END;

        -- Ensure that the paymentTypeID exists
        IF NOT EXISTS(SELECT 1 FROM [dbo].[PaymentType] WHERE [PaymentTypeID] = @paymentTypeID)
        BEGIN;
            SET @errorMessage_FKsDoNotExist += 'The PaymentTypeID does not exist: ' + CONVERT(VARCHAR(20), @paymentTypeID) + ' :::: ';
        END;

        -- Ensure that the paymentTypeCategoryID exists
        IF NOT EXISTS(SELECT 1 FROM [dbo].[PaymentTypeCategory] WHERE [PaymentTypeCategoryID] = @paymentTypeCategoryID)
        BEGIN;
            SET @errorMessage_FKsDoNotExist += 'The PaymentTypeCategoryID does not exist: ' + CONVERT(VARCHAR(20), @paymentTypeCategoryID) + ' :::: ';;
        END;

        -- if there were any FKs that had an issue, send a message back indicating all that had an issue.
        IF (LEN(@errorMessage_FKsDoNotExist) > 0)
        BEGIN;
            THROW 51001, @errorMessage_FKsDoNotExist, 1;
        END;

        /***************************
         * ### END FK check
         **************************/

		-- throw error if we have a null date for the expense date
		IF (@expenseDate IS NULL)
		BEGIN;
			THROW 51002, 'Expense Date cannot be null and must have a value', 1;
		END;

		-- throw error if the expense amount is 0 as you cannot have an expense (or income) = 0
		IF (@expenseAmount = 0)
		BEGIN;
			THROW 51003, 'Expense Amount cannot be valued at "0"', 1;
		END;

        -- if we can find a record with the expenseID pushed in, let's update the information for it
        IF EXISTS(SELECT 1 FROM [dbo].[Expense] WHERE [ExpenseID] = @expenseID)
        BEGIN;
            UPDATE [dbo].[Expense]
            SET
                [ExpenseTypeID]             = @expenseTypeID
                ,[PaymentTypeID]            = @paymentTypeID
                ,[PaymentTypeCategoryID]    = @paymentTypeCategoryID
                ,[ExpenseDescription]       = @expenseDescription
                ,[IsIncome]                 = @isIncome
                ,[IsInvestment]             = @isInvestment
				,[ExpenseDate]				= @expenseDate
				,[ExpenseAmount]			= @expenseAmount
            WHERE
                [expenseID] = @expenseID
        END;
        -- else, we check to see if the expenseID sent in is 0 - indicating a new payment type
        ELSE IF (@expenseID = 0)
        BEGIN;
            -- create new expense
            INSERT INTO [dbo].[Expense](
                [ExpenseTypeID]
                ,[PaymentTypeID]
                ,[PaymentTypeCategoryID]
                ,[ExpenseDescription]
                ,[IsIncome]
                ,[IsInvestment]
				,[ExpenseDate]
				,[ExpenseAmount]
            )
            VALUES(
                @expenseTypeID
                ,@paymentTypeID
                ,@paymentTypeCategoryID
                ,@expenseDescription
                ,@isIncome
                ,@isInvestment
				,@expenseDate
				,@expenseAmount
            );
        END;
        -- if the ID doesn't exists and is not 0, the expense doesn't exist and we can't update it.
        ELSE
        BEGIN;
            DECLARE @errorMessage VARCHAR(100) = 'The expenseID does not exist: ' + CONVERT(VARCHAR(20), @expenseID);
            THROW 51001, @errorMessage, 1;
        END;

    IF @starttrancount = 0 
        COMMIT TRANSACTION
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 AND @starttrancount = 0 
        ROLLBACK TRANSACTION;
    THROW;
END CATCH
GO



/*
===========================================================================================================================================
=    Author:
=        David Lancellotti
=
=    Create date: 
=        03/29/2025 05:50 PM
=
=    Description:
=        Delete a expense record given the expenseID
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE PROCEDURE [dbo].[usp_ExpenseDelete]
    @expenseID AS INT
AS
SET XACT_ABORT, NOCOUNT ON
DECLARE @starttrancount int
BEGIN TRY
    SELECT @starttrancount = @@TRANCOUNT

    IF @starttrancount = 0
        BEGIN TRANSACTION

        -- if we can find a record for the expenseID pushed in, delete it.
        -- if we don't find it - no matter, the expense doesn't exist anyway and there's nothing to do
        IF EXISTS(SELECT 1 FROM [dbo].[Expense] WHERE [ExpenseID] = @expenseID)
        BEGIN;
            DELETE FROM [dbo].[Expense]
            WHERE
                [ExpenseID] = @expenseID
        END;

    IF @starttrancount = 0 
        COMMIT TRANSACTION
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 AND @starttrancount = 0 
        ROLLBACK TRANSACTION;
    THROW;
END CATCH
GO


/************************************************************************
*       #########################################################
*           
*           END stored procedures
*           
*       #########################################################
************************************************************************/



/************************************************************************
*
*
*           BEGIN Views
*
*
************************************************************************/


USE [FinancialApp]
GO

CREATE VIEW [dbo].[vExpenseType]
AS
SELECT
    [ExpenseTypeID]
    ,[ExpenseTypeName]
    ,[ExpenseTypeDescription]
FROM
    [dbo].[ExpenseType]
GO

CREATE VIEW [dbo].[vPaymentTypeCategory]
AS
SELECT
    [PaymentTypeCategoryID]
    ,[PaymentTypeCategoryName]
FROM
    [dbo].[PaymentTypeCategory]
GO

CREATE VIEW [dbo].[vPaymentType]
AS
SELECT
    pt.[PaymentTypeID]              AS [PaymentTypeID]
    ,pt.[PaymentTypeName]           AS [PaymentTypeName]
    ,pt.[PaymentTypeDescription]    AS [PaymentTypeDescription]
    ,ptc.[PaymentTypeCategoryID]    AS [PaymentTypeCategoryID]
    ,ptc.[PaymentTypeCategoryName]  AS [PaymentTypeCategoryName]
FROM
    [dbo].[PaymentType] pt
        JOIN [dbo].[PaymentTypeCategory] ptc ON pt.[PaymentTypeCategoryID] = ptc.[PaymentTypeCategoryID]
GO

CREATE VIEW [dbo].[vExpense]
AS
SELECT
    e.[ExpenseID]                   AS [ExpenseID]
	,e.[ExpenseDate]				AS [ExpenseDate]
	,e.[ExpenseDescription]			AS [ExpenseDescription]
	,e.[ExpenseAmount]				AS [ExpenseAmount]
    ,e.[IsIncome]                   AS [IsIncome]
    ,e.[IsInvestment]               AS [IsInvenstment]
    ,et.[ExpenseTypeID]             AS [ExpenseTypeID]
    ,pt.[PaymentTypeID]             AS [PaymentTypeID]
    ,ptc.[PaymentTypeCategoryID]    AS [PaymentTypeCategoryID]
	,e.[ValidFrom]					AS [LastUpdated]
FROM
    [dbo].[Expense] e
        JOIN [dbo].[ExpenseType] et ON e.[ExpenseTypeID] = et.[ExpenseTypeID]
        JOIN [dbo].[PaymentType] pt ON e.[PaymentTypeID] = pt.[PaymentTypeID]
        JOIN [dbo].[PaymentTypeCategory] ptc ON e.[PaymentTypeCategoryID] = ptc.[PaymentTypeCategoryID]
GO

CREATE VIEW [dbo].[vExpenseDetail]
AS
SELECT
    e.[ExpenseID]                   AS [ExpenseID]
	,e.[ExpenseDate]				AS [ExpenseDate]
	,e.[ExpenseDescription]			AS [ExpenseDescription]
	,e.[ExpenseAmount]				AS [ExpenseAmount]
    ,et.[ExpenseTypeName]           AS [ExpenseTypeName]
    ,pt.[PaymentTypeName]           AS [PaymentTypeName]
    ,ptc.[PaymentTypeCategoryName]  AS [PaymentTypeCategoryName]
    ,e.[IsIncome]                   AS [IsIncome]
    ,e.[IsInvestment]               AS [IsInvestment]
    ,et.[ExpenseTypeID]             AS [ExpenseTypeID]
    ,pt.[PaymentTypeID]             AS [PaymentTypeID]
    ,pt.[PaymentTypeDescription]    AS [PaymentTypeDescription]
    ,ptc.[PaymentTypeCategoryID]    AS [PaymentTypeCategoryID]
	,e.[ValidFrom]					AS [LastUpdated]
FROM
    [dbo].[Expense] e
        JOIN [dbo].[ExpenseType] et ON e.[ExpenseTypeID] = et.[ExpenseTypeID]
        JOIN [dbo].[PaymentType] pt ON e.[PaymentTypeID] = pt.[PaymentTypeID]
        JOIN [dbo].[PaymentTypeCategory] ptc ON e.[PaymentTypeCategoryID] = ptc.[PaymentTypeCategoryID]
GO


/************************************************************************
*       #########################################################
*           
*           END Views
*           
*       #########################################################
************************************************************************/


/************************************************************************
*
*
*           BEGIN Sample Data Entry
*
*
************************************************************************/
USE [FinancialApp]
GO

-- expense type
exec [dbo].[usp_ExpenseTypeUpsert] 0, 'other', 'this expense does not fit into any other category';
DECLARE @expenseTypeID_other INT = @@IDENTITY

-- payment type category
exec [dbo].[usp_PaymentTypeCategoryUpsert] 0, 'cash'
DECLARE @paymentTypeCategoryID_cash INT = @@IDENTITY;

-- payment type
exec [dbo].[usp_PaymentTypeUpsert] 0, 'cash', 'hard currency physically changing hands (i.e. not a cash app)', @paymentTypeCategoryID_cash
DECLARE @paymentTypeID_cash INT = @@IDENTITY;
exec [dbo].[usp_PaymentTypeUpsert] 0, 'cash app', 'virtual currency changing hands (i.e. paypal, venmo, zelle, etc.)', @paymentTypeCategoryID_cash
DECLARE @paymentTypeID_cash_app INT = @@IDENTITY;

-- expense
DECLARE @currentDate DATE = CONVERT(DATE, GETDATE());
exec [dbo].[usp_ExpenseUpsert] 0, @expenseTypeID_other, @paymentTypeID_cash, @paymentTypeCategoryID_cash, 'sample hard cash transation', 0, 0, @currentDate, 100
exec [dbo].[usp_ExpenseUpsert] 0, @expenseTypeID_other, @paymentTypeID_cash_app, @paymentTypeCategoryID_cash, 'sample cash app transation', 0, 0, @currentDate, 234.22

/************************************************************************
*       #########################################################
*           
*           END Sample Data Entry
*           
*       #########################################################
************************************************************************/

/*
select * from vExpense
select * from vExpenseDetail
select * from vExpenseType
select * from vpaymenttypecategory
select * from vpaymenttype
*/