/************************************************************************
*
*
*           BEGIN table creation for FinancialApp database
*
*
************************************************************************/
SET search_path TO FinancialApp;

-- DROP fkey constraints if they exist
ALTER TABLE IF EXISTS public.payment_type
	DROP CONSTRAINT IF EXISTS payment_type_payment_type_category_id_fkey;


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

-- payment_type_category_id_fkey
ALTER TABLE public.payment_type
    ADD CONSTRAINT payment_type_payment_type_category_id_fkey FOREIGN KEY (payment_type_category_id) 
        REFERENCES public.payment_type_category (payment_type_category_id);

/************************************************************************
*       #########################################################
*           
*           END table creation for FinancialApp database
*           
*       #########################################################
************************************************************************/
