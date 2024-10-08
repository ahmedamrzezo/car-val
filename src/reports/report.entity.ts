import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../auth/user.entity";

@Entity()
export default class Report {
	@PrimaryGeneratedColumn()
  id: string;

	@Column({ default: false })
  approved: boolean;

	@Column()
  price: number;

	@Column()
  make: string;

	@Column()
  model: string;

	@Column()
  year: number;

	@Column()
  lng: number;

	@Column()
  lat: number;

	@Column()
  mileage: number;

	@ManyToOne(() => User, user => user.reports)
	user: User;
}