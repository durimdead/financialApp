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
