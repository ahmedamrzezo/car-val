import { AfterInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Report from "../reports/report.entity";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ default: true })
	admin: boolean;

	@OneToMany(() => Report, report => report.user)
	reports: Report[];

	@AfterInsert()
	logInsert() {
		console.log('User inserted', this.id);
	}
}