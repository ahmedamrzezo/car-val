import { AfterInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
  id: string;

	@Column()
  email: string;
	
	@Column()
  password: string;

	@AfterInsert()
	logInsert() {
		console.log('User inserted', this.id);
	}
}