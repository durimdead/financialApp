import express from "express";
import expensesRoutes from "./routes/expensesRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

// Routes
app.use("/api/Expenses", expensesRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
