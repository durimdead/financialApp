import { Router } from "express";
import { getPaymentTypes } from "../controllers/paymentTypesController";

const router = Router();

router.get("/", getPaymentTypes);
// router.post("/SearchByExpenseTypeName", getExpenseTypesBySearchString);
// router.put("/", putExpenses);
// router.post("/", postExpenses);
// router.delete("/:id", deleteItem);

export default router;