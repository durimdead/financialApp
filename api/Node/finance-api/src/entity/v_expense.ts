import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
  name: "v_expense",
  expression: "",
  synchronize: false,
})
export class v_expense {
  @ViewColumn({ name: "expense_id" })
  expenseID?: number;

  @ViewColumn({ name: "expense_type_id" })
  expenseTypeID?: number;
  
  @ViewColumn({ name: "payment_type_id" })
  paymentTypeID?: number;

  @ViewColumn({ name: "payment_type_category_id" })
  paymentTypeCategoryID?: number;

  @ViewColumn({ name: "is_income" })
  isIncome?: boolean;

  @ViewColumn({ name: "is_investment" })
  isInvestment?: boolean;

  @ViewColumn({ name: "expense_description" })
  expenseDescription?: string;

  @ViewColumn({ name: "expense_amount" })
  expenseAmount?: number;

  @ViewColumn({ name: "expense_date" })
  expenseDate?: Date;

//   @ViewColumn({ name: "" })
//   LastUpdated?: Date;
}