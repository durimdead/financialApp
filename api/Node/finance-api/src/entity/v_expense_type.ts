import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
  name: "v_expense_type",
  expression: "",
  synchronize: false,
})
export class v_expense_type {
  @ViewColumn({ name: "expense_type_id" })
  expenseTypeID?: number;

  @ViewColumn({ name: "expense_type_name" })
  expenseTypeName?: string;

  @ViewColumn({ name: "expense_type_description" })
  expenseTypeDescription?: string;
  
  //   @ViewColumn({ name: "" })
  //   LastUpdated?: Date;
}