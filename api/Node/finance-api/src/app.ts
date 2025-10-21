import express from "express";
import cors from "cors";
import expensesRoutes from "./routes/expensesRoutes";
import expenseTypesRoutes from "./routes/expenseTypesRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
// Configure CORS options
const corsOptions: cors.CorsOptions = {
	origin: ['http://localhost:4200','https://localhost:4200'], // Replace with your frontend URL
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	credentials: true, // Allow sending cookies/authentication headers
	optionsSuccessStatus: 204, // Status for preflight requests
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use("/api/Expenses", expensesRoutes);
app.use("/api/ExpenseTypes", expenseTypesRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
