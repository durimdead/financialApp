import { Router } from "express";
import {
  getExpenses, putExpenses
} from "../controllers/expensesController";

const router = Router();

router.get("/", getExpenses);
router.put("/", putExpenses);
// router.get("/:id", getItemById);
// router.post("/", createItem);
// router.delete("/:id", deleteItem);

export default router;
