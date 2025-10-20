import { Router } from "express";
import {
  getExpenses, putExpenses, postExpenses
} from "../controllers/expensesController";

const router = Router();

router.get("/", getExpenses);
router.put("/", putExpenses);
router.post("/", postExpenses);
// router.get("/:id", getItemById);
// router.delete("/:id", deleteItem);

export default router;
