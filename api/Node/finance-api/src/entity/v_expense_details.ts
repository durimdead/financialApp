import { ViewEntity, ViewColumn} from "typeorm";

@ViewEntity({
	name: "v_expense_detail",
	expression: '',
	synchronize: false
})
export class v_expense_detail {
  @ViewColumn({name: 'expense_id'})
  ExpenseID?: number;

  @ViewColumn({name: 'expense_type_id'})
  ExpenseTypeID?: number;

  @ViewColumn({name: 'payment_type_id'})
  PaymentTypeID?: number;

  @ViewColumn({name: 'payment_type_category_id'})
  PaymentTypeCategoryID?: number;

  @ViewColumn({name: 'expense_type_name'})
  ExpenseTypeName?: string;

  @ViewColumn({name: 'payment_type_name'})
  PaymentTypeName?: string;

  @ViewColumn({name: 'payment_type_description'})
  PaymentTypeDescription?: string;

  @ViewColumn({name: 'payment_type_category_name'})
  PaymentTypeCategoryName?: string;

  @ViewColumn({name: 'is_income'})
  IsIncome?: boolean;

  @ViewColumn({name: 'is_investment'})
  IsInvestment?: boolean;

  @ViewColumn({name: 'expense_description'})
  ExpenseDescription?: string;

  @ViewColumn({name: 'expense_amount'})
  ExpenseAmount?: number;

  @ViewColumn({name: 'expense_date'})
  ExpenseDate?: Date;

  // @ViewColumn()
  // LastUpdated?: Date;
}
