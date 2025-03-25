/************************************************************************
*
*
*           BEGIN database script from SSMS "script as" command
*
*
************************************************************************/

USE [master]
GO

/****** Object:  Database [FinancialApp]    Script Date: 9/17/2022 12:58:43 PM ******/
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
CREATE LOGIN [FinancialAppAccount] WITH PASSWORD=N'myTestAccount123'
     , DEFAULT_DATABASE=[FinancialApp]
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

CREATE TABLE [dbo].[PeriodicElement](
    [PeriodicElementId] INT IDENTITY(1,1) NOT NULL
    ,[PeriodicElementName] VARCHAR(100) NOT NULL
    ,[PeriodicElementSymbol] VARCHAR(3) NOT NULL
    ,[PeriodicElementWeight] FLOAT NOT NULL
    ,CONSTRAINT [PK_PeriodicElementID] PRIMARY KEY CLUSTERED
    ([PeriodicElementId] ASC) 
    ,[ValidFrom] datetime2 GENERATED ALWAYS AS ROW START
    ,[ValidTo] datetime2 GENERATED ALWAYS AS ROW END
    ,PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
    )
    WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PeriodicElementAudit])
);
GO

CREATE TABLE [dbo].[ExpenseType](
	[ExpenseTypeID] INT IDENTITY(1,1) NOT NULL
	,[ExpenseTypeName] VARCHAR(30) NOT NULL
	,[ExpenseTypeDescription] VARCHAR(250)
    ,CONSTRAINT [ExpenseTypeID] PRIMARY KEY CLUSTERED
	([ExpenseTypeID] ASC)
	,[ValidFrom] datetime2 GENERATED ALWAYS AS ROW START
    ,[ValidTo] datetime2 GENERATED ALWAYS AS ROW END
    ,PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
    )
    WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[ExpenseTypeAudit])
);
GO

CREATE TABLE [dbo].[PaymentType](
    [PaymentTypeID] INT IDENTITY(1,1) NOT NULL
    ,[PaymentTypeName] VARCHAR(30) NOT NULL
    ,[PaymentTypeDescription] VARCHAR(250) NOT NULL
    ,CONSTRAINT [PaymentTypeID] PRIMARY KEY CLUSTERED
    ([PaymentTypeID] ASC)
    ,[ValidFrom] datetime2 GENERATED ALWAYS AS ROW START
    ,[ValidTo] datetime2 GENERATED ALWAYS AS ROW END
    ,PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
    )
    WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = [dbo].[PaymentTypeAudit])
);
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
=        03/17/2025 12:00PM
=
=    Description:
=        Update or insert a periodic element record with the relevant information
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE PROCEDURE [dbo].[usp_PeriodicElementUpsert]
    @periodicElementID AS INTEGER
    ,@periodicElementName AS VARCHAR(50)
    ,@periodicElementSymbol AS VARCHAR(3)
    ,@periodicElementWeight AS DECIMAL(10,6)
AS
SET XACT_ABORT, NOCOUNT ON
DECLARE @starttrancount int
BEGIN TRY
    SELECT @starttrancount = @@TRANCOUNT

    IF @starttrancount = 0
        BEGIN TRANSACTION

        -- trim our varchar inputs to ensure we have no whitespace
        SET @periodicElementName = LTRIM(RTRIM(@periodicElementName));
        SET @periodicElementSymbol = LTRIM(RTRIM(@periodicElementSymbol));

        -- if we can find a record with the periodicElementID pushed in, let's update the information for it
        IF EXISTS(SELECT 1 FROM [dbo].[PeriodicElement] WHERE [PeriodicElementId] = @periodicElementID)
        BEGIN;
            UPDATE [dbo].[PeriodicElement]
            SET
                [PeriodicElementName] = @periodicElementName
                ,[PeriodicElementSymbol] = @periodicElementSymbol
                ,[PeriodicElementWeight] = @periodicElementWeight
            WHERE
                [PeriodicElementId] = @periodicElementID
        END;
        -- else, we check to see if the periodicElementID sent in is 0 - indicating a new record
        ELSE IF (@periodicElementID = 0)
        BEGIN;
            INSERT INTO [dbo].[PeriodicElement](
                [PeriodicElementName]
                ,[PeriodicElementSymbol]
                ,[PeriodicElementWeight]
            )
            VALUES(
                @periodicElementName
                ,@periodicElementSymbol
                ,@periodicElementWeight
            );
        END;
        -- if the ID doesn't exists and is not 0, the periodic element doesn't exist and we can't update it.
        ELSE
        BEGIN;
            THROW 51001, 'The PeriodicElementID does not exist', 1;
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
=        03/17/2025 12:00PM
=
=    Description:
=        Delete a periodic element record given the PeriodicElementID
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE PROCEDURE [dbo].[usp_PeriodicElementDelete]
    @periodicElementID AS INTEGER
AS
SET XACT_ABORT, NOCOUNT ON
DECLARE @starttrancount int
BEGIN TRY
    SELECT @starttrancount = @@TRANCOUNT

    IF @starttrancount = 0
        BEGIN TRANSACTION

        -- if we can find a record for the periodicElementID pushed in, delete it.
        -- if we don't find it - no matter, the periodic element doesn't exist anyway and there's nothing to do
        IF EXISTS(SELECT 1 FROM [dbo].[PeriodicElement] WHERE [PeriodicElementId] = @periodicElementID)
        BEGIN;
            DELETE FROM [dbo].[PeriodicElement]
            WHERE
                [PeriodicElementId] = @periodicElementID
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

CREATE VIEW [dbo].[vPeriodicElement]
AS
SELECT
    [PeriodicElementId]
    ,[PeriodicElementName]
    ,[PeriodicElementSymbol]
    ,[PeriodicElementWeight]
FROM
    [dbo].[PeriodicElement]
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
exec [dbo].[usp_PeriodicElementUpsert] 0, N'Hydrogen', N'H', 1.0079
exec [dbo].[usp_PeriodicElementUpsert] 0, N'Helium', N'He', 4.0026
exec [dbo].[usp_PeriodicElementUpsert] 0, N'Lithium', N'Li', 6.941
exec [dbo].[usp_PeriodicElementUpsert] 0, N'Beryllium', N'Be', 9.0122
exec [dbo].[usp_PeriodicElementUpsert] 0, N'Boron', N'B', 10.811
exec [dbo].[usp_PeriodicElementUpsert] 0, N'Carbon', N'C', 12.0107
exec [dbo].[usp_PeriodicElementUpsert] 0, N'Nitrogen', N'N', 14.0067
exec [dbo].[usp_PeriodicElementUpsert] 0, N'Oxygen', N'O', 15.9994
exec [dbo].[usp_PeriodicElementUpsert] 0, N'Fluorine', N'F', 18.9984
exec [dbo].[usp_PeriodicElementUpsert] 0, N'Neon', N'Ne', 20.1797
/************************************************************************
*       #########################################################
*           
*           END Sample Data Entry
*           
*       #########################################################
************************************************************************/