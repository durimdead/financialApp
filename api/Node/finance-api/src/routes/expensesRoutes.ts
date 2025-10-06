import { Router } from "express";
import {
  getExpenses
} from "../controllers/expensesController";

const router = Router();

router.get("/", getExpenses);
// router.get("/:id", getItemById);
// router.post("/", createItem);
// router.put("/:id", updateItem);
// router.delete("/:id", deleteItem);

export default router;
