import { ViewEntity, ViewColumn} from "typeorm";

@ViewEntity({
  name: "v_payment_type",
  expression: "",
  synchronize: false,
})
export class v_payment_type {
  @ViewColumn({ name: "payment_type_id" })
  PaymentTypeID?: number;

  @ViewColumn({ name: "payment_type_category_id" })
  PaymentTypeCategoryID?: number;

  @ViewColumn({ name: "payment_type_name" })
  PaymentTypeName?: string;

  @ViewColumn({ name: "payment_type_description" })
  PaymentTypeDescription?: string;

  @ViewColumn({ name: "payment_type_category_name" })
  PaymentTypeCategoryName?: string;

  // @ViewColumn()
  // LastUpdated?: Date;
}
