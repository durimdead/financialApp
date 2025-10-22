import { Router } from "express";
import { getPaymentTypes, getPaymentTypesBySearchString } from "../controllers/paymentTypesController";

const router = Router();

router.get("/", getPaymentTypes);
router.post("/SearchByPaymentTypeName", getPaymentTypesBySearchString);
// router.put("/", putExpenses);
// router.post("/", postExpenses);
// router.delete("/:id", deleteItem);

export default router;