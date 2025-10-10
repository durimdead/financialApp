import { ViewEntity, ViewColumn} from "typeorm";

@ViewEntity({
  name: "v_payment_type_category",
  expression: "",
  synchronize: false,
})
export class v_payment_type_category {
  @ViewColumn({ name: "payment_type_category_id" })
  PaymentTypeCategoryID?: number;

  @ViewColumn({ name: "payment_type_category_name" })
  PaymentTypeCategoryName?: string;
  
  // @ViewColumn()
  // LastUpdated?: Date;
}
