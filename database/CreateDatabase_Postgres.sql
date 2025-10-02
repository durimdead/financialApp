/************************************************************************
*
*
*           BEGIN table creation for FinancialApp database
*
*
************************************************************************/
SET search_path TO FinancialApp;

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

-- date night, car maintenance, tolls, grocery, etc.
DROP TABLE IF EXISTS public.expense_type;
CREATE TABLE IF NOT EXISTS public.expense_type
(
    expense_type_id serial NOT NULL
	,expense_type_name VARCHAR(50) NOT NULL
    ,expense_type_description VARCHAR(250)
    ,CONSTRAINT expensetype_expense_type_id_pkey PRIMARY KEY (expense_type_id)
    ,CONSTRAINT expensetype_expense_type_name_key UNIQUE (expense_type_name)
);

-- credit card, debit card, cash app, check, etc
DROP TABLE IF EXISTS public.payment_type_category;
CREATE TABLE public.payment_type_category(
    payment_type_category_id SERIAL NOT NULL
    ,payment_type_category_name VARCHAR(30) NOT NULL
    ,CONSTRAINT payment_type_category_payment_type_category_id_pkey PRIMARY KEY (payment_type_category_id)
	,CONSTRAINT payment_type_category_payment_type_category_name_key UNIQUE(payment_type_category_name)
);

-- chase freedom, chase debit, cash, venmo, zelle, etc
DROP TABLE IF EXISTS public.payment_type;
CREATE TABLE public.payment_type(
    payment_type_id SERIAL NOT NULL
    ,payment_type_category_id INT NOT NULL
    ,payment_type_name VARCHAR(50) NOT NULL
    ,payment_type_description VARCHAR(250) NOT NULL
	,CONSTRAINT payment_type_payment_type_name_key UNIQUE(payment_type_name)
    ,CONSTRAINT payment_type_payment_type_id_pkey PRIMARY KEY (payment_type_id)
);

-- fkey for payment_type_category_id
ALTER TABLE public.payment_type
    ADD CONSTRAINT payment_type_payment_type_category_id_fkey FOREIGN KEY (payment_type_category_id) 
        REFERENCES public.payment_type_category (payment_type_category_id);


DROP TABLE IF EXISTS public.expense;
CREATE TABLE public.expense(
    expense_id SERIAL NOT NULL
    ,expense_type_id INT NOT NULL
    ,payment_type_id INT NOT NULL
    ,payment_type_category_id INT NOT NULL
    ,expense_description VARCHAR(200) NOT NULL
    ,is_income BIT NOT NULL
    ,is_investment BIT NOT NULL
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
CREATE OR REPLACE PROCEDURE public.expense_type_upsert(
    expense_type_id_param INT
    ,expense_type_name_param VARCHAR(50)
	,expense_type_description_param VARCHAR(250)
	,OUT was_success_out_param BOOLEAN
	,OUT exception_message_text_out_param TEXT
	,OUT exception_detail_out_param TEXT
	,OUT exception_hint_out_param TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
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
		RAISE EXCEPTION 'The expense_type_id does not exist';
	END IF;

	was_success_out_param = true;

	-- catch any exception that happens throughout the execution of the stored procedure
	EXCEPTION
		WHEN OTHERS THEN
			GET STACKED DIAGNOSTICS exception_message_text_out_param = MESSAGE_TEXT,
									exception_detail_out_param = PG_EXCEPTION_DETAIL,
									exception_hint_out_param = PG_EXCEPTION_HINT;
			was_success_out_param = false;
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
CREATE OR REPLACE PROCEDURE public.payment_type_category_upsert(
    payment_type_category_id_param INT
    ,payment_type_category_name_param VARCHAR(50)
	,OUT was_success_out_param BOOLEAN
	,OUT exception_message_text_out_param TEXT
	,OUT exception_detail_out_param TEXT
	,OUT exception_hint_out_param TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
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
		RAISE EXCEPTION 'The payment_type_category_id % does not exist', payment_type_category_id_param;
	END IF;

	was_success_out_param = true;

	-- catch any exception that happens throughout the execution of the stored procedure
	EXCEPTION
		WHEN OTHERS THEN
			GET STACKED DIAGNOSTICS exception_message_text_out_param = MESSAGE_TEXT,
									exception_detail_out_param = PG_EXCEPTION_DETAIL,
									exception_hint_out_param = PG_EXCEPTION_HINT;
			was_success_out_param = false;
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
    expense_type_id 			AS "ExpenseTypeID"
    ,expense_type_name 			AS "ExpenseTypeName"
    ,expense_type_description 	AS "ExpenseTypeDescription"
FROM
    public.expense_type
;

CREATE OR REPLACE VIEW public.v_payment_type_category
AS
SELECT
    payment_type_category_id 	AS "PaymentTypeCategoryID"
    ,payment_type_category_name AS "PaymentTypeCategoryName"
FROM
    public.payment_type_category
;

CREATE OR REPLACE VIEW public.v_payment_type
AS
SELECT
    pt.payment_type_id              	AS "PaymentTypeID"
    ,pt.payment_type_name           	AS "PaymentTypeName"
    ,pt.payment_type_description   		AS "PaymentTypeDescription"
    ,ptc.payment_type_category_id   	AS "PaymentTypeCategoryID"
    ,ptc.payment_type_category_name 	AS "PaymentTypeCategoryName"
FROM
    public.payment_type pt
        JOIN public.payment_type_category ptc ON pt.payment_type_category_id = ptc.payment_type_category_id
;

CREATE OR REPLACE VIEW public.v_expense
AS
SELECT
    e.expense_id                   	AS "ExpenseID"
	,e.expense_date					AS "ExpenseDate"
	,e.expense_description			AS "ExpenseDescription"
	,e.expense_amount				AS "ExpenseAmount"
    ,e.is_income                   	AS "IsIncome"
    ,e.is_investment               	AS "IsInvenstment"
    ,et.expense_type_id             AS "ExpenseTypeID"
    ,pt.payment_type_id            	AS "PaymentTypeID"
    ,ptc.payment_type_category_id   AS "PaymentTypeCategoryID"
FROM
    public.expense e
        JOIN public.expense_type et ON e.expense_type_id = et.expense_type_id
        JOIN public.payment_type pt ON e.payment_type_id = pt.payment_type_id
        JOIN public.payment_type_category ptc ON e.payment_type_category_id = ptc.payment_type_category_id
;

CREATE OR REPLACE VIEW public.v_expense_detail
AS
SELECT
    e.expense_id                   		AS "ExpenseID"
	,e.expense_date						AS "ExpenseDate"
	,e.expense_description				AS "ExpenseDescription"
	,e.expense_amount					AS "ExpenseAmount"
    ,et.expense_type_name           	AS "ExpenseTypeName"
    ,pt.payment_type_name           	AS "PaymentTypeName"
    ,ptc.payment_type_category_name  	AS "PaymentTypeCategoryName"
    ,e.is_income                   		AS "IsIncome"
    ,e.is_investment               		AS "IsInvestment"
    ,et.expense_type_id             	AS "ExpenseTypeID"
    ,pt.payment_type_id             	AS "PaymentTypeID"
    ,pt.payment_type_description    	AS "PaymentTypeDescription"
    ,ptc.payment_type_category_id    	AS "PaymentTypeCategoryID"
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
    "ExpenseTypeID"
    ,"ExpenseTypeName"
    ,"ExpenseTypeDescription"
FROM
    public.v_expense_type
;

CREATE OR REPLACE VIEW public."vPaymentTypeCategory"
AS
SELECT
    "PaymentTypeCategoryID"
    ,"PaymentTypeCategoryName"
FROM
    public.v_payment_type_category
;

CREATE OR REPLACE VIEW public."vPaymentType"
AS
SELECT
    "PaymentTypeID"
	,"PaymentTypeName"
    ,"PaymentTypeDescription"
    ,"PaymentTypeCategoryID"
    ,"PaymentTypeCategoryName"
FROM
    public.v_payment_type
;

CREATE OR REPLACE VIEW public."vExpense"
AS
SELECT
    "ExpenseID"
	,"ExpenseDate"
	,"ExpenseDescription"
	,"ExpenseAmount"
    ,"IsIncome"
    ,"IsInvenstment"
    ,"ExpenseTypeID"
    ,"PaymentTypeID"
    ,"PaymentTypeCategoryID"
FROM
    public.v_expense
;

CREATE OR REPLACE VIEW public."vExpenseDetail"
AS
SELECT
    "ExpenseID"
	,"ExpenseDate"
	,"ExpenseDescription"
	,"ExpenseAmount"
    ,"ExpenseTypeName"
    ,"PaymentTypeName"
    ,"PaymentTypeCategoryName"
    ,"IsIncome"
    ,"IsInvestment"
    ,"ExpenseTypeID"
    ,"PaymentTypeID"
    ,"PaymentTypeDescription"
    ,"PaymentTypeCategoryID"
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
INSERT INTO public.expense_type(expense_type_name, expense_type_description)
VALUES('other', 'this expense does not fit into any other category')

-- payment type category
INSERT INTO public.payment_type_category(payment_type_category_name)
VALUES('cash');

-- payment type
INSERT INTO public.payment_type(payment_type_name, payment_type_description, payment_type_category_id)
VALUES	('cash', 'hard currency physically changing hands (i.e. not a cash app)', 1)
		,('cash app', 'virtual currency changing hands (i.e. paypal, venmo, zelle, etc.)', 1);

-- expense
insert into public.expense(expense_type_id, payment_type_id, payment_type_category_id, expense_description, is_income, is_investment, expense_date, expense_amount)
VALUES(1, 1, 1, 'sample hard cash transation', 0::bit, 0::bit, now(), 100.00)
		,(1, 2, 1, 'sample cash app transation', 0::bit, 0::bit, now(), 234.22);

/*
select * from public.v_expense;
select * from public.v_expense_detail;
select * from public.v_expense_type;
select * from public.v_payment_type_category;
select * from public.v_payment_type;
*/