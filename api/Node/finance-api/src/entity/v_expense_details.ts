import { Entity, ViewEntity, ViewColumn, DataSource } from "typeorm";

@ViewEntity({expression: `
	SELECT 
		"ExpenseID"
		,"ExpenseTypeID"
		,"PaymentTypeID"
		,"PaymentTypeCategoryID"
		,"ExpenseTypeName"
		,"PaymentTypeName"
		,"PaymentTypeDescription"
		,"PaymentTypeCategoryName"
		,"IsIncome"
		,"IsInvestment"
		,"ExpenseDescription"
		,"ExpenseAmount"
		,"ExpenseDate"
	FROM
		v_expense_detail
	`})
export class v_expense_details {
	@ViewColumn()
	ExpenseID: number | undefined;
	
	@ViewColumn()
	ExpenseTypeID: number | undefined;

	@ViewColumn()
	PaymentTypeID: number | undefined;
	
	@ViewColumn()
	PaymentTypeCategoryID: number | undefined;
	
	@ViewColumn()
	ExpenseTypeName: string | undefined;
	
	@ViewColumn()
	PaymentTypeName: string | undefined;
	
	@ViewColumn()
	PaymentTypeDescription: string | undefined;
	
	@ViewColumn()
	PaymentTypeCategoryName: string | undefined;
	
	@ViewColumn()
	IsIncome: boolean | undefined;
	
	@ViewColumn()
	IsInvestment: boolean | undefined;
	
	@ViewColumn()
	ExpenseDescription: string | undefined;
	
	@ViewColumn()
	ExpenseAmount: number | undefined;
	
	@ViewColumn()
	ExpenseDate: Date | undefined;
	
	// @ViewColumn()
	// LastUpdated: Date | undefined;
}
