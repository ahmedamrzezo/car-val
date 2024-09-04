import { DataSource } from "typeorm";

export const appDataSource = new DataSource({
	type: "sqlite",
	database: 'dev.sqlite',
	entities: ['**/*.entity.ts'],
	migrations: [__dirname + '/migrations/*.ts'],
});