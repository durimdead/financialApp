import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "FinancialAppAccount",
  password: process.env.DB_PASSWORD || "myTestAccount123",
  database: process.env.DB_NAME || "FinancialApp",
  synchronize: false, // Use with caution in production; consider migrations
  logging: false,
  entities: ["src/entity/**/*.ts"], // Path to your entity files
  migrations: [],
  subscribers: [],
});