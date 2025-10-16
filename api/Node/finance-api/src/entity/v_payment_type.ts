import { ViewEntity, ViewColumn} from "typeorm";

@ViewEntity({
  name: "v_payment_type",
  expression: "",
  synchronize: false,
})
export class v_payment_type {
  @ViewColumn({ name: "payment_type_id" })
  paymentTypeID?: number;

  @ViewColumn({ name: "payment_type_category_id" })
  paymentTypeCategoryID?: number;

  @ViewColumn({ name: "payment_type_name" })
  paymentTypeName?: string;

  @ViewColumn({ name: "payment_type_description" })
  paymentTypeDescription?: string;

  @ViewColumn({ name: "payment_type_category_name" })
  paymentTypeCategoryName?: string;

  // @ViewColumn()
  // LastUpdated?: Date;
}
