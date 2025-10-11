/*******************************************************************************
*
*
*	Creating the Account for the database. Run this before anything else.
*
*
*******************************************************************************/
CREATE ROLE "FinancialAppAccount" WITH
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE
	INHERIT
	NOREPLICATION
	NOBYPASSRLS
	CONNECTION LIMIT -1
	PASSWORD 'myTestAccount123';

ALTER ROLE "FinancialAppAccount"
	LOGIN;

GRANT pg_read_all_data, pg_create_subscription TO "FinancialAppAccount";
/*******************************************************************************
*
*	
*	### END Creating the Account for the database.
*
*
*******************************************************************************/

/*******************************************************************************
*
*
*	Create the actual database. This block MUST be run on its own
*
*
*******************************************************************************/
CREATE DATABASE "FinancialApp"
    WITH
    OWNER = "FinancialAppAccount"
    ENCODING = 'UTF8'
    LOCALE_PROVIDER = 'libc'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

/*******************************************************************************
*
*
*	###END Creation of actual database.
*
*
*******************************************************************************/


/*******************************************************************************
*
*	EVERYTHING below this section can be run all at once 
* 		This section includes : schema, views, sprocs, and sample data
*
*******************************************************************************/



-- set scope and drop all sprocs, views, FKs, etc
SET search_path TO FinancialApp;

-- drop all the stored procedures
DROP PROCEDURE IF EXISTS public.proc_expense_type_upsert;
DROP PROCEDURE IF EXISTS public.proc_expense_type_delete;
DROP PROCEDURE IF EXISTS public.proc_payment_type_category_upsert;
DROP PROCEDURE IF EXISTS public.proc_payment_type_category_delete;
DROP PROCEDURE IF EXISTS public.proc_payment_type_upsert;
DROP PROCEDURE IF EXISTS public.proc_payment_type_delete;
DROP PROCEDURE IF EXISTS public.proc_expense_upsert;
DROP PROCEDURE IF EXISTS public.proc_expense_delete;

-- DROP all views if they exist
DROP VIEW IF EXISTS public."vExpenseType";
DROP VIEW IF EXISTS public."vPaymentTypeCategory";
DROP VIEW IF EXISTS public."vPaymentType";
DROP VIEW IF EXISTS public."vExpense";
DROP VIEW IF EXISTS public."vExpenseDetail";
DROP VIEW IF EXISTS public.v_expense_type;
DROP VIEW IF EXISTS public.v_payment_type_category;
DROP VIEW IF EXISTS public.v_payment_type;
DROP VIEW IF EXISTS public.v_expense;
DROP VIEW IF EXISTS public.v_expense_detail;

-- DROP fkey constraints for public.payment_type if they exist
ALTER TABLE IF EXISTS public.payment_type
	DROP CONSTRAINT IF EXISTS payment_type_payment_type_category_id_fkey;

-- DROP fkey constraints for public.expense if they exist
ALTER TABLE IF EXISTS public.expense
	DROP CONSTRAINT IF EXISTS expense_payment_type_id_fkey;
ALTER TABLE IF EXISTS public.expense
    DROP CONSTRAINT IF EXISTS expense_payment_type_category_id_fkey;
ALTER TABLE IF EXISTS public.expense
    DROP CONSTRAINT IF EXISTS expense_expense_type_id_fkey;

-- DROP all tables if they exist
DROP TABLE IF EXISTS public.expense_type;
DROP TABLE IF EXISTS public.payment_type_category;
DROP TABLE IF EXISTS public.payment_type;
DROP TABLE IF EXISTS public.expense;

/************************************************************************
*
*
*           BEGIN table creation for FinancialApp database
*
*
************************************************************************/

-- date night, car maintenance, tolls, grocery, etc.
CREATE TABLE IF NOT EXISTS public.expense_type
(
    expense_type_id serial NOT NULL
	,expense_type_name TEXT NOT NULL
    ,expense_type_description TEXT
    ,CONSTRAINT expensetype_expense_type_id_pkey PRIMARY KEY (expense_type_id)
    ,CONSTRAINT expensetype_expense_type_name_key UNIQUE (expense_type_name)
);

-- credit card, debit card, cash app, check, etc
CREATE TABLE public.payment_type_category(
    payment_type_category_id SERIAL NOT NULL
    ,payment_type_category_name TEXT NOT NULL
    ,CONSTRAINT payment_type_category_payment_type_category_id_pkey PRIMARY KEY (payment_type_category_id)
	,CONSTRAINT payment_type_category_payment_type_category_name_key UNIQUE(payment_type_category_name)
);

-- chase freedom, chase debit, cash, venmo, zelle, etc
CREATE TABLE public.payment_type(
    payment_type_id SERIAL NOT NULL
    ,payment_type_category_id INT NOT NULL
    ,payment_type_name TEXT NOT NULL
    ,payment_type_description TEXT NOT NULL
	,CONSTRAINT payment_type_payment_type_name_key UNIQUE(payment_type_name)
    ,CONSTRAINT payment_type_payment_type_id_pkey PRIMARY KEY (payment_type_id)
);

-- fkey for payment_type_category_id
ALTER TABLE public.payment_type
    ADD CONSTRAINT payment_type_payment_type_category_id_fkey FOREIGN KEY (payment_type_category_id) 
        REFERENCES public.payment_type_category (payment_type_category_id);


CREATE TABLE public.expense(
    expense_id SERIAL NOT NULL
    ,expense_type_id INT NOT NULL
    ,payment_type_id INT NOT NULL
    ,payment_type_category_id INT NOT NULL
    ,expense_description TEXT NOT NULL
    ,is_income BOOLEAN NOT NULL
    ,is_investment BOOLEAN NOT NULL
	,expense_date DATE NOT NULL
	,expense_amount DECIMAL(20,4) -- can store up to 1 quadrillion with 4 decimal places to cover most to all currency types
    ,CONSTRAINT expense_expense_id_pkey PRIMARY KEY (expense_id)
);

-- fkey for payment_type_id
ALTER TABLE public.expense
	ADD CONSTRAINT expense_payment_type_id_fkey FOREIGN KEY (payment_type_id)
		REFERENCES public.payment_type (payment_type_id);

-- fkey for payment_type_category_id
ALTER TABLE public.expense
    ADD CONSTRAINT expense_payment_type_category_id_fkey FOREIGN KEY (payment_type_category_id) 
        REFERENCES public.payment_type_category (payment_type_category_id);

-- fkey for expense_type_id
ALTER TABLE public.expense
    ADD CONSTRAINT expense_expense_type_id_fkey FOREIGN KEY (expense_type_id) 
        REFERENCES public.expense_type (expense_type_id);


/************************************************************************
*       #########################################################
*           
*           END table creation for FinancialApp database
*           
*       #########################################################
************************************************************************/


/************************************************************************
*
*
*           BEGIN stored procedures
*
*
************************************************************************/


SET search_path TO FinancialApp;
/*
===========================================================================================================================================
=    Author:
=        David Lancellotti
=
=    Create date: 
=        10/01/2025 03:00PM
=
=    Description:
=        Update or insert an Expense Type with the relevant information
=		 Returns "true" on success, "false" on failure with details in the "exception_" prepended variables
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE OR REPLACE PROCEDURE public.proc_expense_type_upsert(
    expense_type_id_param INT
    ,expense_type_name_param TEXT
	,expense_type_description_param TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
	exception_message_text TEXT;
	exception_detail TEXT;
	exception_hint TEXT;
BEGIN
	-- trim our varchar inputs to ensure we have no whitespace
	SELECT TRIM(BOTH ' ' FROM expense_type_name_param) INTO expense_type_name_param;
	SELECT TRIM(BOTH ' ' FROM expense_type_description_param) INTO expense_type_description_param;

	-- if we can find a record with the expense_type_id pushed in, let's update the information for it
	IF EXISTS (SELECT FROM public.expense_type WHERE expense_type_id = expense_type_id_param) THEN
		UPDATE public.expense_type
		SET
			expense_type_name = expense_type_name_param
			,expense_type_description = expense_type_description_param
		WHERE
			expense_type_id = expense_type_id_param;
	-- else, we check to see if the expense_type_id sent in is 0 - indicating a new record
	ELSIF (expense_type_id_param = 0) THEN
		INSERT INTO public.expense_type(
		expense_type_name
		,expense_type_description
		)
		VALUES(
			expense_type_name_param
			,expense_type_description_param
		);
	-- if the ID doesn't exists and is not 0, the expense type doesn't exist and we can't update it.
	ELSE
		RAISE EXCEPTION 'The expense type ID % does not exist', expense_type_id_param;
	END IF;
	
	-- catch any exception that happens throughout the execution of the stored procedure
	EXCEPTION
		WHEN OTHERS THEN
			GET STACKED DIAGNOSTICS exception_message_text = MESSAGE_TEXT,
									exception_detail = PG_EXCEPTION_DETAIL,
									exception_hint = PG_EXCEPTION_HINT;
			RAISE EXCEPTION 'MESSAGE : % :::: DETAIL % :::: HINT %', exception_message_text, exception_detail, exception_hint;
END;
$$;


/*
===========================================================================================================================================
=    Author:
=        David Lancellotti
=
=    Create date: 
=        10/02/2025 01:30PM
=
=    Description:
=        Delete a expense type record given the expense type ID
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE OR REPLACE PROCEDURE public.proc_expense_type_delete(
    expense_type_id_param INT
)
LANGUAGE plpgsql
AS $$
DECLARE
	exception_message_text TEXT;
	exception_detail TEXT;
	exception_hint TEXT;
BEGIN

	-- if we can find a record for the expense type ID pushed in, delete it.
	-- if we don't find it - no matter, the expense type doesn't exist anyway and there's nothing to do
	IF EXISTS(SELECT FROM public.expense_type WHERE expense_type_id = expense_type_id_param) THEN
		DELETE FROM public.expense_type
		WHERE
			expense_type_id = expense_type_id_param
		;
	END IF;

	-- catch any exception that happens throughout the execution of the stored procedure
	EXCEPTION
		WHEN OTHERS THEN
			GET STACKED DIAGNOSTICS exception_message_text = MESSAGE_TEXT,
									exception_detail = PG_EXCEPTION_DETAIL,
									exception_hint = PG_EXCEPTION_HINT;
			RAISE EXCEPTION 'MESSAGE : % :::: DETAIL % :::: HINT %', exception_message_text, exception_detail, exception_hint;
END;
$$;


/*
===========================================================================================================================================
=    Author:
=        David Lancellotti
=
=    Create date: 
=        10/02/2025 01:00PM
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
CREATE OR REPLACE PROCEDURE public.proc_payment_type_category_upsert(
    payment_type_category_id_param INT
    ,payment_type_category_name_param TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
	exception_message_text TEXT;
	exception_detail TEXT;
	exception_hint TEXT;
BEGIN
	-- trim our varchar inputs to ensure we have no whitespace
	SELECT TRIM(BOTH ' ' FROM payment_type_category_name_param) INTO payment_type_category_name_param;

	-- if we can find a record with the payment_type_category_id pushed in, let's update the information for it
	IF EXISTS (SELECT FROM public.payment_type_category WHERE payment_type_category_id = payment_type_category_id_param) THEN
		UPDATE public.payment_type_category
		SET
			payment_type_category_name = payment_type_category_name_param
		WHERE
			payment_type_category_id = payment_type_category_id_param;
	-- else, we check to see if the payment_type_category_id sent in is 0 - indicating a new record
	ELSIF (payment_type_category_id_param = 0) THEN
		INSERT INTO public.payment_type_category(
			payment_type_category_name
		)
		VALUES(
			payment_type_category_name_param
		);
	-- if the ID doesn't exists and is not 0, the payment type category doesn't exist and we can't update it.
	ELSE
		RAISE EXCEPTION 'The payment type category ID % does not exist', payment_type_category_id_param;
	END IF;

	-- catch any exception that happens throughout the execution of the stored procedure
	EXCEPTION
		WHEN OTHERS THEN
			GET STACKED DIAGNOSTICS exception_message_text = MESSAGE_TEXT,
									exception_detail = PG_EXCEPTION_DETAIL,
									exception_hint = PG_EXCEPTION_HINT;
			RAISE EXCEPTION 'MESSAGE : % :::: DETAIL % :::: HINT %', exception_message_text, exception_detail, exception_hint;
END;
$$;



/*
===========================================================================================================================================
=    Author:
=        David Lancellotti
=
=    Create date: 
=        10/02/2025 01:30PM
=
=    Description:
=        Delete a payment type category record given the payment type category ID
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE OR REPLACE PROCEDURE public.proc_payment_type_category_delete(
    payment_type_category_id_param INT
)
LANGUAGE plpgsql
AS $$
DECLARE
	exception_message_text TEXT;
	exception_detail TEXT;
	exception_hint TEXT;
BEGIN

	-- if we can find a record for the payment type category ID pushed in, delete it.
	-- if we don't find it - no matter, the payment type category doesn't exist anyway and there's nothing to do
	IF EXISTS(SELECT FROM public.payment_type_category WHERE payment_type_category_id = payment_type_category_id_param) THEN
		DELETE FROM public.payment_type_category
		WHERE
			payment_type_category_id = payment_type_category_id_param
		;
	END IF;

	-- catch any exception that happens throughout the execution of the stored procedure
	EXCEPTION
		WHEN OTHERS THEN
			GET STACKED DIAGNOSTICS exception_message_text = MESSAGE_TEXT,
									exception_detail = PG_EXCEPTION_DETAIL,
									exception_hint = PG_EXCEPTION_HINT;
			RAISE EXCEPTION 'MESSAGE : % :::: DETAIL % :::: HINT %', exception_message_text, exception_detail, exception_hint;
END;
$$;

/*
===========================================================================================================================================
=    Author:
=        David Lancellotti
=
=    Create date: 
=        10/02/2025 01:00PM
=
=    Description:
=       Update or insert a payment type record with the relevant information.
=       Additionally, ensure that the payment type id exists - throws error if it does not.
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE OR REPLACE PROCEDURE public.proc_payment_type_upsert(
    payment_type_id_param INT
    ,payment_type_name_param TEXT
	,payment_type_description_param TEXT
	,payment_type_category_id_param INT
)
LANGUAGE plpgsql
AS $$
DECLARE
	exception_message_text TEXT;
	exception_detail TEXT;
	exception_hint TEXT;
BEGIN
	-- trim our varchar inputs to ensure we have no whitespace
	SELECT TRIM(BOTH ' ' FROM payment_type_name_param) INTO payment_type_name_param;
	SELECT TRIM(BOTH ' ' FROM payment_type_description_param) INTO payment_type_description_param;

	-- if we can find a record with the payment_type_id pushed in, let's update the information for it
	IF EXISTS (SELECT FROM public.payment_type WHERE payment_type_id = payment_type_id_param) THEN
		UPDATE public.payment_type
		SET
			payment_type_name = payment_type_name_param
			,payment_type_description = payment_type_description_param
			,payment_type_category_id = payment_type_category_id_param
		WHERE
			payment_type_id = payment_type_id_param;
	-- else, we check to see if the payment_type_id sent in is 0 - indicating a new record
	ELSIF (payment_type_id_param = 0) THEN
		INSERT INTO public.payment_type(
			payment_type_name
			,payment_type_description
			,payment_type_category_id
		)
		VALUES(
			payment_type_name_param
			,payment_type_description_param
			,payment_type_category_id_param
		);
	-- if the ID doesn't exists and is not 0, the payment type category doesn't exist and we can't update it.
	ELSE
		RAISE EXCEPTION 'The payment type ID % does not exist', payment_type_id_param;
	END IF;

	-- catch any exception that happens throughout the execution of the stored procedure
	EXCEPTION
		WHEN OTHERS THEN
			GET STACKED DIAGNOSTICS exception_message_text = MESSAGE_TEXT,
									exception_detail = PG_EXCEPTION_DETAIL,
									exception_hint = PG_EXCEPTION_HINT;
			RAISE EXCEPTION 'MESSAGE : % :::: DETAIL % :::: HINT %', exception_message_text, exception_detail, exception_hint;
END;
$$;





/*
===========================================================================================================================================
=    Author:
=        David Lancellotti
=
=    Create date: 
=        10/02/2025 01:00PM
=
=    Description:
=        Delete a payment type record given the payment type ID
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE OR REPLACE PROCEDURE public.proc_payment_type_delete(
    payment_type_id_param INT
)
LANGUAGE plpgsql
AS $$
DECLARE
	exception_message_text TEXT;
	exception_detail TEXT;
	exception_hint TEXT;
BEGIN

	-- if we can find a record for the payment type ID pushed in, delete it.
	-- if we don't find it - no matter, the payment type doesn't exist anyway and there's nothing to do
	IF EXISTS(SELECT FROM public.payment_type WHERE payment_type_id = payment_type_id_param) THEN
		DELETE FROM public.payment_type
		WHERE
			payment_type_id = payment_type_id_param
		;
	END IF;

	-- catch any exception that happens throughout the execution of the stored procedure
	EXCEPTION
		WHEN OTHERS THEN
			GET STACKED DIAGNOSTICS exception_message_text = MESSAGE_TEXT,
									exception_detail = PG_EXCEPTION_DETAIL,
									exception_hint = PG_EXCEPTION_HINT;
			RAISE EXCEPTION 'MESSAGE : % :::: DETAIL % :::: HINT %', exception_message_text, exception_detail, exception_hint;
END;
$$;



/*
===========================================================================================================================================
=    Author:
=        David Lancellotti
=
=    Create date: 
=        10/02/2025 01:00PM
=
=    Description:
=       Update or insert a expense record with the relevant information.
=       Additionally, ensure that the FK IDs exist - throws error if any do not.
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE OR REPLACE PROCEDURE public.proc_expense_upsert(
    expense_id_param INT
	,expense_type_id_param INT
	,payment_type_id_param INT
	,payment_type_category_id_param INT
    ,expense_description_param TEXT
	,is_income_param BOOLEAN
	,is_investment_param BOOLEAN
	,expense_date_param DATE
	,expense_amount_param DECIMAL(20, 4)
)
LANGUAGE plpgsql
AS $$
DECLARE
	exception_message_text TEXT;
	exception_detail TEXT;
	exception_hint TEXT;
BEGIN
	-- trim our varchar inputs to ensure we have no whitespace
	SELECT TRIM(BOTH ' ' FROM expense_description_param) INTO expense_description_param;

	/***************************
	 * Check for FKs existing
	 **************************/
	-- Ensure that the expense type ID exists
	IF NOT EXISTS(SELECT FROM public.expense_type WHERE expense_type_id = expense_type_id_param) THEN
		RAISE EXCEPTION 'The expense type ID % does not exist', expense_type_id_param;
	END IF;

	-- Ensure that the paymentTypeID exists
	IF NOT EXISTS(SELECT 1 FROM public.payment_type WHERE payment_type_id = payment_type_id_param) THEN
		RAISE EXCEPTION 'The payment type ID % does not exist', payment_type_id_param;
	END IF;

	-- Ensure that the payment type category ID exists
	IF NOT EXISTS(SELECT 1 FROM public.payment_type_category WHERE payment_type_category_id = payment_type_category_id_param) THEN
		RAISE EXCEPTION 'The payment type category ID % does not exist', payment_type_category_id_param;
	END IF;

	/***************************
	 * ### END FK check
	 **************************/

	-- throw error if we have a null date for the expense date
	IF (expense_date_param IS NULL) THEN
		RAISE EXCEPTION 'Expense Date cannot be null and must have a value';
	END IF;

	-- throw error if the expense amount is 0 as you cannot have an expense (or income) = 0
	IF (expense_amount_param = 0) THEN
		RAISE EXCEPTION 'Expense Amount cannot be valued at "0"';
	END IF;

	-- if we can find a record with the expense_id pushed in, let's update the information for it
	IF EXISTS (SELECT FROM public.expense WHERE expense_id = expense_id_param) THEN
		UPDATE public.expense
		SET
			expense_type_id 				= expense_type_id_param
			,payment_type_id				= payment_type_id_param
			,payment_type_category_id 		= payment_type_category_id_param
			,expense_description			= expense_description_param
			,is_income						= is_income_param
			,is_investment					= is_investment_param
			,expense_date					= expense_date_param
			,expense_amount					= expense_amount_param
		WHERE
			expense_id = expense_id_param;
	-- else, we check to see if the expense_id_param sent in is 0 - indicating a new record
	ELSIF (expense_id_param = 0) THEN
		INSERT INTO public.expense(
			expense_type_id
			,payment_type_id
			,payment_type_category_id
			,expense_description
			,is_income
			,is_investment
			,expense_date
			,expense_amount
		)
		VALUES(
			expense_type_id_param
			,payment_type_id_param
			,payment_type_category_id_param
			,expense_description_param
			,is_income_param
			,is_investment_param
			,expense_date_param
			,expense_amount_param
		);
	-- if the ID doesn't exists and is not 0, the payment type category doesn't exist and we can't update it.
	ELSE
		RAISE EXCEPTION 'The expense ID % does not exist', expense_id_param;
	END IF;

	-- catch any exception that happens throughout the execution of the stored procedure
	EXCEPTION
		WHEN OTHERS THEN
			GET STACKED DIAGNOSTICS exception_message_text = MESSAGE_TEXT,
									exception_detail = PG_EXCEPTION_DETAIL,
									exception_hint = PG_EXCEPTION_HINT;
			RAISE EXCEPTION 'MESSAGE : % :::: DETAIL % :::: HINT %', exception_message_text, exception_detail, exception_hint;
END;
$$;


/*
===========================================================================================================================================
=    Author:
=        David Lancellotti
=
=    Create date: 
=        10/02/2025 01:00PM
=
=    Description:
=        Delete a expense record given the expense ID
=
=    UPDATES:
=                                DateTime
=    Author                        mm/dd/yyyy HH:mm    Description
=    =====================        =============        =======================================================================================
=
=
===========================================================================================================================================
*/
CREATE OR REPLACE PROCEDURE public.proc_expense_delete(
    expense_id_param INT
)
LANGUAGE plpgsql
AS $$
DECLARE
	exception_message_text TEXT;
	exception_detail TEXT;
	exception_hint TEXT;
BEGIN

	-- if we can find a record for the expense ID pushed in, delete it.
	-- if we don't find it - no matter, the expense doesn't exist anyway and there's nothing to do
	IF EXISTS(SELECT FROM public.expense WHERE expense_id = expense_id_param) THEN
		DELETE FROM public.expense
		WHERE
			expense_id = expense_id_param
		;
	END IF;

	-- catch any exception that happens throughout the execution of the stored procedure
	EXCEPTION
		WHEN OTHERS THEN
			GET STACKED DIAGNOSTICS exception_message_text = MESSAGE_TEXT,
									exception_detail = PG_EXCEPTION_DETAIL,
									exception_hint = PG_EXCEPTION_HINT;
			RAISE EXCEPTION 'MESSAGE : % :::: DETAIL % :::: HINT %', exception_message_text, exception_detail, exception_hint;
END;
$$;


/************************************************************************
*
*
*           BEGIN Views
*
*
************************************************************************/
SET search_path TO FinancialApp;
CREATE OR REPLACE VIEW public.v_expense_type
AS
SELECT
    expense_type_id 			AS expense_type_id
    ,expense_type_name 			AS expense_type_name
    ,expense_type_description 	AS expense_type_description
FROM
    public.expense_type
;

CREATE OR REPLACE VIEW public.v_payment_type_category
AS
SELECT
    payment_type_category_id 	AS payment_type_category_id
    ,payment_type_category_name AS payment_type_category_name
FROM
    public.payment_type_category
;

CREATE OR REPLACE VIEW public.v_payment_type
AS
SELECT
    pt.payment_type_id              	AS payment_type_id
    ,pt.payment_type_name           	AS payment_type_name
    ,pt.payment_type_description   		AS payment_type_description
    ,ptc.payment_type_category_id   	AS payment_type_category_id
    ,ptc.payment_type_category_name 	AS payment_type_category_name
FROM
    public.payment_type pt
        JOIN public.payment_type_category ptc ON pt.payment_type_category_id = ptc.payment_type_category_id
;

CREATE OR REPLACE VIEW public.v_expense
AS
SELECT
    e.expense_id                   	AS expense_id
	,e.expense_date					AS expense_date
	,e.expense_description			AS expense_description
	,e.expense_amount				AS expense_amount
    ,e.is_income                   	AS is_income
    ,e.is_investment               	AS is_investment
    ,et.expense_type_id             AS expense_type_id
    ,pt.payment_type_id            	AS payment_type_id
    ,ptc.payment_type_category_id   AS payment_type_category_id
FROM
    public.expense e
        JOIN public.expense_type et ON e.expense_type_id = et.expense_type_id
        JOIN public.payment_type pt ON e.payment_type_id = pt.payment_type_id
        JOIN public.payment_type_category ptc ON e.payment_type_category_id = ptc.payment_type_category_id
;

CREATE OR REPLACE VIEW public.v_expense_detail
AS
SELECT
    e.expense_id                   		AS expense_id
	,e.expense_date						AS expense_date
	,e.expense_description				AS expense_description
	,e.expense_amount					AS expense_amount
    ,et.expense_type_name           	AS expense_type_name
    ,pt.payment_type_name           	AS payment_type_name
    ,ptc.payment_type_category_name  	AS payment_type_category_name
    ,e.is_income                   		AS is_income
    ,e.is_investment               		AS is_investment
    ,et.expense_type_id             	AS expense_type_id
    ,pt.payment_type_id             	AS payment_type_id
    ,pt.payment_type_description    	AS payment_type_description
    ,ptc.payment_type_category_id    	AS payment_type_category_id
FROM
    public.expense e
        JOIN public.expense_type et ON e.expense_type_id = et.expense_type_id
        JOIN public.payment_type pt ON e.payment_type_id = pt.payment_type_id
        JOIN public.payment_type_category ptc ON e.payment_type_category_id = ptc.payment_type_category_id
;


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
*           BEGIN Aliased Views
*					Used to avoid updating C# WebAPI models
*					when utilizing postgres as database.
*
*
************************************************************************/
SET search_path TO FinancialApp;
CREATE OR REPLACE VIEW public."vExpenseType"
AS
SELECT
    expense_type_id				AS "ExpenseTypeID"
    ,expense_type_name			AS "ExpenseTypeName"
    ,expense_type_description	AS "ExpenseTypeDescription"
FROM
    public.v_expense_type
;

CREATE OR REPLACE VIEW public."vPaymentTypeCategory"
AS
SELECT
    payment_type_category_id		AS "PaymentTypeCategoryID"
    ,payment_type_category_name		AS "PaymentTypeCategoryName"
FROM
    public.v_payment_type_category
;

CREATE OR REPLACE VIEW public."vPaymentType"
AS
SELECT
    payment_type_id					AS "PaymentTypeID"
	,payment_type_name				AS "PaymentTypeName"
    ,payment_type_description		AS "PaymentTypeDescription"
    ,payment_type_category_id		AS "PaymentTypeCategoryID"
    ,payment_type_category_name		AS "PaymentTypeCategoryName"
FROM
    public.v_payment_type
;

CREATE OR REPLACE VIEW public."vExpense"
AS
SELECT
    expense_id					AS "ExpenseID"
	,expense_date				AS "ExpenseDate"
	,expense_description		AS "ExpenseDescription"
	,expense_amount				AS "ExpenseAmount"
    ,is_income					AS "IsIncome"
    ,is_investment				AS "IsInvenstment"
    ,expense_type_id			AS "ExpenseTypeID"
    ,payment_type_id			AS "PaymentTypeID"
    ,payment_type_category_id	AS "PaymentTypeCategoryID"
FROM
    public.v_expense
;

CREATE OR REPLACE VIEW public."vExpenseDetail"
AS
SELECT
    expense_id					AS "ExpenseID"	
	,expense_date				AS "ExpenseDate"	
	,expense_description		AS "ExpenseDescription"	
	,expense_amount				AS "ExpenseAmount"	
    ,expense_type_name			AS "ExpenseTypeName"	
    ,payment_type_name			AS "PaymentTypeName"	
    ,payment_type_category_name	AS "PaymentTypeCategoryName"	
    ,is_income					AS "IsIncome"	
    ,is_investment				AS "IsInvestment"	
    ,expense_type_id			AS "ExpenseTypeID"	
    ,payment_type_id			AS "PaymentTypeID"	
    ,payment_type_description	AS "PaymentTypeDescription"	
    ,payment_type_category_id	AS "PaymentTypeCategoryID"	
FROM
    public.v_expense_detail
;

/************************************************************************
*       #########################################################
*           
*           END Aliased Views
*           
*       #########################################################
************************************************************************/
-- expense type
call public.proc_expense_type_upsert(0, 'other', 'this expense does not fit into any other category');

-- payment type category
call public.proc_payment_type_category_upsert(0, 'cash');

-- payment type
call public.proc_payment_type_upsert(0, 'cash', 'hard currency physically changing hands (i.e. not a cash app)', 1);
call public.proc_payment_type_upsert(0, 'cash app', 'virtual currency changing hands (i.e. paypal, venmo, zelle, etc.)', 1);

-- expense
call public.proc_expense_upsert(0, 1, 1, 1, 'sample hard cash transation', false::BOOLEAN, false::BOOLEAN, now()::DATE, 100.00);
call public.proc_expense_upsert(0, 1, 2, 1, 'sample cash app transation', false::BOOLEAN, false::BOOLEAN, now()::DATE, 234.22);

/*
select * from public.v_expense;
select * from public.v_expense_detail;
select * from public.v_expense_type;
select * from public.v_payment_type_category;
select * from public.v_payment_type;
*/