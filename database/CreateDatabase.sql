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
