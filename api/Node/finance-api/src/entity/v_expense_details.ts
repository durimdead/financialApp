import { Entity, ViewEntity, ViewColumn, DataSource } from "typeorm";

@ViewEntity({
  expression: `
	SELECT 
		expense_id
		,expense_date
		,expense_description
		,expense_amount
		,expense_type_name
		,payment_type_name
		,payment_type_category_name
		,is_income
		,is_investment
		,expense_type_id
		,payment_type_id
		,payment_type_description
		,payment_type_category_id
	FROM
		v_expense_detail
	`,
})
export class v_expense_details {
  @ViewColumn({name: 'expense_id'})
  ExpenseID?: number;

  @ViewColumn({name: 'expense_date'})
  ExpenseTypeID?: number;

  @ViewColumn({name: 'expense_description'})
  PaymentTypeID?: number;

  @ViewColumn({name: 'expense_amount'})
  PaymentTypeCategoryID?: number;

  @ViewColumn({name: 'expense_type_name'})
  ExpenseTypeName?: string;

  @ViewColumn({name: 'payment_type_name'})
  PaymentTypeName?: string;

  @ViewColumn({name: 'payment_type_category_name'})
  PaymentTypeDescription?: string;

  @ViewColumn({name: 'is_income'})
  PaymentTypeCategoryName?: string;

  @ViewColumn({name: 'is_investment'})
  IsIncome?: boolean;

  @ViewColumn({name: 'expense_type_id'})
  IsInvestment?: boolean;

  @ViewColumn({name: 'payment_type_id'})
  ExpenseDescription?: string;

  @ViewColumn({name: 'payment_type_description'})
  ExpenseAmount?: number;

  @ViewColumn({name: 'payment_type_category_id'})
  ExpenseDate?: Date;

  // @ViewColumn()
  // LastUpdated?: Date;
}
