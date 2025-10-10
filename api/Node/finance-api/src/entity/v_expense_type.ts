import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
  name: "v_expense_type",
  expression: "",
  synchronize: false,
})
export class v_expense_type {
  @ViewColumn({ name: "expense_type_id" })
  ExpenseTypeID?: number;

  @ViewColumn({ name: "expense_type_name" })
  ExpenseTypeName?: string;

  @ViewColumn({ name: "expense_type_description" })
  ExpenseTypeDescription?: string;
  
  //   @ViewColumn({ name: "" })
  //   LastUpdated?: Date;
}