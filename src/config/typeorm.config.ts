import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { DB_NAME } from "../constants";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
	constructor(private configService: ConfigService) { }

	createTypeOrmOptions(): TypeOrmModuleOptions {
		const dbConfig: TypeOrmModuleOptions = {
			type: 'sqlite',
			synchronize: false,
			database: this.configService.get(DB_NAME),
			autoLoadEntities: true
		};

		switch (process.env.NODE_ENV) {
			case 'production':
				Object.assign(dbConfig, {
					type: 'postgres',
					entities: ['**/*.entity.js'],
					url: process.env.DATABASE_URL,
					migrationsRun: true,
					ssl: {
						rejectUnauthorized: false
					}
				} as Partial<TypeOrmModuleOptions>);
				break;
			case 'test':
				Object.assign(dbConfig, {
					migrationsRun: true,
					keepConnectionAlive: true,
					synchronize: true,
				} as Partial<TypeOrmModuleOptions>);
				break;
		};
		return dbConfig;
	}
}