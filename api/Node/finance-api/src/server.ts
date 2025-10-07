import "reflect-metadata";
import app from "./app";
import config from "./config/config";
import { AppDataSource } from "./data-source";

AppDataSource.initialize().then(() => {
	app.listen(config.port, () => {
		console.log(`Server running on port ${config.port}`);
	});
})


