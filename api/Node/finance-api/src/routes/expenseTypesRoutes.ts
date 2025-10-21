import { Router } from "express";
import { getExpenseTypes } from "../controllers/expenseTypesController";

const router = Router();

router.get("/", getExpenseTypes);
// router.put("/", putExpenses);
// router.post("/", postExpenses);
// router.get("/:id", getItemById);
// router.delete("/:id", deleteItem);

export default router;
