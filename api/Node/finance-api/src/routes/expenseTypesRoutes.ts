import { Router } from "express";
import { getExpenseTypesBySearchString, getExpenseTypes } from "../controllers/expenseTypesController";

const router = Router();

router.get("/", getExpenseTypes);
router.post("/SearchByExpenseTypeName", getExpenseTypesBySearchString);
// router.put("/", putExpenses);
// router.post("/", postExpenses);
// router.delete("/:id", deleteItem);

export default router;
